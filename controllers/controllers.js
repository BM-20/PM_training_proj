const transactionLog = require('../models/transactions')

// fetch all tickers
const getPortfolio = async (req, res) => {  
    res.send("Adding a new ticker...");
}

const getTicker = async (req, res) => {  
    res.send("Adding a new ticker...");
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



