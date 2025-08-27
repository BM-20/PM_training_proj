const router = express.Router();
const portfolioController = require('../controllers/controllers');

// portfolio routes
router.get('/portfolio',  portfolioControllers.getPortfolio); // fetch all tickers
router.get('/portfolio/:ticker', portfolioControllers.getTicker); // fetch a specific ticker
router.post('/portfolio/', portfolioControllers.addTicker); // add a new ticker 
router.delete('/portfolio/:ticker', portfolioControllers.deleteTicker); // delete a ticker
router.patch('/portfolio/:ticker', portfolioControllers.updateVolumeOfTicker); // update shares volume for spcific ticker

// auth routes
// router.post('/login',  portfolioControllers.); // fetch all tickers
// router.post('/register', portfolioControllers.); // fetch a specific ticker

