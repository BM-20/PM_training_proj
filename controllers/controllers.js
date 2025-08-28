const transactionLog = require('../models/transactions')
const Stocks = require('../models/stocks')

// fetch all tickers
const getPortfolio = async (req, res) => {  
    res.render('index', {data : "additional data"})
}

const getTicker = async (req, res) => {  
    res.send("Adding a new ticker...");
}

const addTicker = async (req, res) => {
    
    const { ticker, amount, userId } = req.body;
    
    try 
    {
        // add new stock to the portfolio
        const newStock = await Stocks.create
        ({  
            ticker,
            amount,
            userId  
        });

        // log transaction
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

// deletes ticker from user portfolio
const deleteTicker = async (req, res) => { 
    
    const ticker =  req.params.ticker



    
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



