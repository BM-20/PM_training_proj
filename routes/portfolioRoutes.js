const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/controllers');
const authController = require('../controllers/auth');
const { logger, agent, authenticateToken, redirectIfLoggedIn} = require('../utils/middleware');

// portfolio routes
router.get('/portfolio', logger, agent, authenticateToken, portfolioController.getPortfolio); // fetch all tickers
router.get('/portfolio/:ticker', logger, agent, authenticateToken, portfolioController.getTicker); // fetch a specific ticker
router.get('/portfolio/add/add',logger, agent, authenticateToken,  portfolioController.add); // add a new ticker 
router.post('/portfolio',logger, agent, authenticateToken,  portfolioController.addTicker); // add a new ticker 
router.delete('/portfolio/:ticker', logger, agent, authenticateToken, portfolioController.deleteTicker); // delete a ticker
router.patch('/portfolio/:ticker', logger, agent, authenticateToken, portfolioController.updateVolumeOfTicker); // update shares volume for spcific ticker

// auth routes
router.post('/auth/login', redirectIfLoggedIn, authController.login); // add a new ticker 
router.get('/auth/login', redirectIfLoggedIn, authController.login); // add a new ticker
router.post('/auth/register', redirectIfLoggedIn, authController.register); // add a new ticker 
router.get('/auth/register', redirectIfLoggedIn, authController.register); // add a new ticker 




module.exports = router;