const transactionLog = require('../models/transactions')
const Users = require('../models/users');

// fetch all tickers
const getPortfolio = async (req, res) => {  
    res.send("Getting all stocks...")
    try {
        const stock = req.Users.stocks
        res.status(200).json(stock);
}
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed fetching stocks' });
}
}
const getTicker = async (req, res) => {  
    res.send("Getting ticker...");
try {
    const { ticker } = req.params;
    const userId = req.user.id;

    const user = await Users.findByPk(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const stock = Users.stocks.find(s => s.ticker === ticker);
    if (!stock) {
        return res.status(404).json({ message: 'Ticker not found in portfolio' });
    }

    res.status(200).json(stock);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
}
}

const addTicker = async (req, res) => {  
    res.send("Adding a new ticker...")
    const { date, ticker, priceBought, priceSold, userId } = req.body;

    try 
    {
        const newTransaction = await transactionLog.create
        ({
            date,
            ticker,
            priceBought,
            priceSold,
            userId  
        });

        res.status(201).json({
            "message": " new transaction logged ",
            "transaction": newTransaction
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating transaction log", error });
    }
    // 
}

const deleteTicker = async (req, res) => { 
    try {
        const { ticker } = req.params;
        const userId = req.user.id;

        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const stockIndex = user.stocks.findIndex(s => s.ticker === ticker);
        if (stockIndex === -1) {
            return res.status(404).json({ message: 'Ticker not found in portfolio' });
        }

        user.stocks.splice(stockIndex, 1);
        await user.save();

        res.status(200).json({ message: 'Ticker removed from portfolio' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

    
    
}

const updateTicker = async (req, res) => {  
    res.send("Updating ticker...")
    //stock
    // ;
}

module.exports = { 
    getPortfolio,
    getTicker,
    addTicker,
    deleteTicker,
    updateTicker,
    };


    
