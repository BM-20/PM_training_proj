const jwt = require('jsonwebtoken');
require('dotenv').config();

// log time, method, and request path
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
};

// log agent
const agent = (req, res, next) => {
    const userAgent = req.get('User-Agent') || 'Group Project';
    console.log(`User-Agent: ${userAgent}`);
    next();
};

// authenticate token
function authenticateToken(req, res, next) {

  console.log("cookies " , req.cookies);          
  
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.user = user;
    next();
  });
}

module.exports = { 
    logger, 
    agent,
    authenticateToken

};