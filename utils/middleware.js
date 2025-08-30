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

  // const authHeader = req.headers['authorization'];
  // const token = authHeader?.split(' ')[1];

  // verify cookie 
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });

    req.user = user;
    next();
  });
}

// redirect a user if they are already logged ub
/*function redirectIfLoggedIn(req, res, next) {

  if (req.cookies.access_token) {
    return res.redirect("/portfolio"); 
  }
  next();
} */
function redirectIfLoggedIn(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) return next();

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(); // invalid token → let them log in/register

    // valid token → redirect to portfolio
    req.user = user;
    return res.redirect("/portfolio");
  });
}


module.exports = { 
    logger, 
    agent,
    authenticateToken,
    redirectIfLoggedIn

}; 

