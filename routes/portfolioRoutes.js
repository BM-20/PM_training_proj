const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/controllers');
const authController = require('../controllers/auth');
const { logger, agent, authenticateToken, redirectIfLoggedIn} = require('../utils/middleware');

// portfolio routes
router.get('/portfolio', logger, agent, authenticateToken, portfolioController.getPortfolio); // fetch all tickers

// create new portfolio
router.post('/portfolio/create', logger, agent, authenticateToken, portfolioController.createPortfolio); 

// open a specific portolio
router.get('/portfolio/:stocks', logger, agent, authenticateToken, portfolioController.getPortfolioStocks); 

// add a new ticker to a specific portfolio
router.post('/portfolio/:id', logger, agent, authenticateToken,  portfolioController.addTicker);

// fetch a specific ticker
router.get('/portfolio/:id/stock/:ticker', logger, agent, authenticateToken, portfolioController.getTicker);

// update stock quantity
router.post('/portfolio/:id/stock/:ticker', logger, agent, authenticateToken, portfolioController.updateVolumeOfTicker);

// handle downloading financial data
router.get('/portfolio/:id/transactions/download/', logger, agent, authenticateToken, portfolioController.downloadTransactionData);

// delete a portfolio
router.delete('/portfolio/delete/:id', logger, agent, authenticateToken, portfolioController.deletePortfolio); 


// auth routes
router.post('/auth/login', redirectIfLoggedIn, authController.login); // add a new ticker 
router.get('/auth/login', redirectIfLoggedIn, authController.login); // add a new ticker
router.post('/auth/register', redirectIfLoggedIn, authController.register); // add a new ticker 
router.get('/auth/register', redirectIfLoggedIn, authController.register); // add a new ticker 

// chat bot
router.post('/api/chat', logger, agent, authenticateToken, portfolioController.chatBot); // add a new ticker 




module.exports = router;