const transactionLog = require('../models/transactions')
var request = require('request');
const { Users, transactionLog } = require('../models/users');

// fetch all tickers
const getPortfolio = async (req, res) => {  
    res.send("Adding a new ticker...");
}

const getTicker = async (req, res) => {  
    res.send("Adding a new ticker...");
try {
    const { ticker } = req.params;
    const userId = req.user.id;

    const user = await Users.findByPk(userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const stock = user.stocks.find(s => s.ticker === ticker);
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
    res.send("Adding a new ticker...");
}

const updateVolumeOfTicker = async (req, res) => {  
    res.send("Adding a new ticker...");
}

module.exports = { 
    getPortfolio,
    getTicker,
    addTicker,
    deleteTicker,
    updateVolumeOfTicker,
    };



module.exports = {getTicker}
