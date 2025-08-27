const Users = require('../models/users')
const jwt = require('jsonwebtoken');

// fetch all tickers
const login = async (req, res) => { 

    const { firstname, lastname, username, password } = req.body;

    const user = await Users.findOne({
        where: {
            username: username,
            password : password
            },
        });  

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const payload = { id: user.id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
        token : token,
        user : user });
}

const register = async (req, res) => {  

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

module.exports = { 
    login,
    register,
};



