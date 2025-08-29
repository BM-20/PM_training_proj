const Users = require('../models/users')
const jwt = require('jsonwebtoken');

// fetch all tickers
const login = async (req, res) => { 

    // if get, fetch render the login page
    if (req.method === "GET")
    {
        res.render('login', {})
    }

    // otherwise handle login credentials using a post request
    else
    {
        const { username, password } = req.body;

        try {
            // look for the user in the table
            const user = await Users.findOne({
            where: {
                username: username,
                password : password
                },
            });  

            // if user doesnt exist throw an error
            if (!user) return res.status(401).json({ error: 'Invalid credentials' });
            const payload = { id: user.id, username: user.username };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res
            
                .cookie("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                })
                .status(200)
                .json({ message: "Logged in successfully" });
                
            } 
            catch (error) {
                console.log("error loging in " , error)
            }
        }
    }


const register = async (req, res) => {  

    // if get, fetch render the login page
    if (req.method === "GET")
    {
        res.render('register', {})
    }
    else
    {
        // get user details 
        const { firstname, lastname, username, password } = req.body;

        // do some input validation
        if (!username || !password) return res.status(401).json({ error: 'Invalid credentials' });

        // create new user
        try
        {
            const newUser = await Users.create(
                {
                firstname : firstname,
                lastname : lastname,
                username: username, 
                password: password 
            });

            // create a new user and redirect the login page
            res.redirect('/auth/login')

        } 
        catch (error) 
        {
            // re render registration page with error message
            res
                .status(500)
                .render('register', 
                    {
                    error : true
                    })     
        }
    }
}

module.exports = { 
    login,
    register,  
};



