const Users = require('../models/users')
const jwt = require('jsonwebtoken');

// fetch all tickers
const login = async (req, res) => { 

    // if get, fetch render the login page
    if (req.method === "GET")
    {
        res.render('index', {})
    }

    // otherwise handle login credentials using a post request
    else
    {
        const { username, password } = req.body;
        console.log(`username ${username}, password ${password}`)

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
        res.render('index', {})
    }
    else
    {
        // TODO: ensure that a new user being added to the db has unique username

        // get user details 
        const { firstname, lastname, username, password } = req.body;

        // do some input validation
        if (!username || !password) return res.status(401).json({ error: 'Invalid credentials' });

        // create new user
        try {
            const newUser = await Users.create({
                firstname : firstname,
                lastname : lastname,
                username: username, 
                password: password });

            res.status(201).json({
                message : "new user created ",
                user : {...newUser}
            })
        } catch (error) {
            res.status(500).send("error creating new user")
        }
    }
}

module.exports = { 
    login,
    register,
        
};



