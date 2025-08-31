const transactionLog = require('../models/transactions')
const Stocks = require('../models/stocks')
const Portfolios = require('../models/portfolios')
const portfolioHistory = require('../models/portfolioHistory')

const axios = require('axios')
const sequelize = require('../utils/connectToDB');
const { VertexAI } = require('@google/genai');

// const client = new VertexAI({
//   projectId: "your-project-id", 
//   location: "global",
// });


const getPortfolio = async (req, res) => { 
    try {

        // fetch all the users portfolios
        const userId = req.user.id;
        
        // load portfolios with stocks
        const portfolios = await Portfolios.findAll({
            where: { userId },
            include: [{ model: Stocks }]
        });

        // massage data for EJS
        const portfolioData = portfolios.map(p => {
            const stocks = p.Stocks || [];
            const totalValue = stocks.reduce((sum, s) => sum + (s.amount * s.priceBought), 0);

            return {
            id: p.id,
            name: p.name,
            totalValue,
            stockCount: stocks.length
            };
        });

        res.render('dashboard', { portfolios: portfolioData });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



// fetch all tickers
const getPortfolioStocks = async (req, res) => { 
    allStockData = []

    const portfolioHistory = [
      { date: "2025-08-01", value: 10000 },
      { date: "2025-08-02", value: 10200 }, 
      { date: "2025-08-03", value: 1300 }
    ];

    try {
        //getting stocks for a specific user
        const userId = req.user.id;

        let userStocks = await Stocks.findAll({
            where : {
                userId
            }
        })

        for (const stock of userStocks) {
            let data = await getTickerData(userId, stock.dataValues.ticker);
            let stockInfo = {
                ...data,
                ...stock.dataValues
            }
            allStockData.push(stockInfo)
        }

        console.log("----------- ALL STOCK DATA ------------- ")
        console.log(allStockData)
        
        const portfolioHistory = [
            { date: "2025-08-01", value: 10000 },
            { date: "2025-08-02", value: 10200 },
            { date: "2025-08-03", value: 9800 }
            ];

        res.render('dashboard', { 
            stocks: allStockData,
            portfolioHistory

         })
    }
        catch (error) {
            res.status(500).json({ message: 'Failed fetching stocks' });
    }
    
}

const getTicker = async (req, res) => { 
    
    try {
        const { id: userId } = req.user;
        const { ticker } = req.params;

        const data = await getTickerData(userId, ticker);
        res.status(200).json(data);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// TODO : FIX ERROR CODES
// NOTE: making the assumption that as the user adds a stock to the system we are 
// its value is determined by current pricing. Finhub api doesnt offer historical data for free
const addTicker = async (req, res) => {
    const { ticker, amount } = req.body;

    if (!ticker || !amount ) {
        return res.status(400).json({
            message: "Ticker, date and amount are required"
        });
    }

    const t = await sequelize.transaction();

    try {
        const userId = req.user.id;

        // Fetch the current stock price
        const response = await axios.get("https://finnhub.io/api/v1/quote", {
            params: {
                symbol: ticker.toUpperCase(),
                token: process.env.FINHUB_API_KEY
            }
        });

        // check if the ticker exists
        if (!response.data || (response.data.c === 0 && response.data.t === 0)) {
            await t.rollback();
            return res.status(404).json({ message: "Invalid or unknown stock symbol" });
        }

        const priceBought = response.data.c;

        // Check if stock already exists in users table
        const haveStockAlready = await Stocks.findOne({
            where: { 
                userId : userId, 
                ticker : ticker,
                },
            transaction: t
        });

        if (haveStockAlready) {
            await t.rollback();  
            return res.status(403).json({ message: "Stock already exists" });
        }

        // Add new stock to the users portfolio
        const newStock = await Stocks.create(
            { ticker, amount, priceBought, userId},
            { transaction: t }
        );

        // Log the transaction information
        const newTransaction = await transactionLog.create(
            {
                date: new Date(),
                ticker,
                priceBought,
                userId
            },
            { transaction: t }
        );

        // commit the transaction if all goes well
        await t.commit();

        return res.status(201).json({
            message: "New stock added and transaction logged",
            transaction: newTransaction
        });

    } catch (error) {
        await t.rollback();
        console.error(error);
        return res.status(500).json({ message: "Error adding ticker", error });
    }
};


// deletes ticker from user portfolio
const deleteTicker = async (req, res) => { 
    const ticker =  req.params.ticker 
}

const updateVolumeOfTicker = async (req, res) => {  
    res.send("Adding a new ticker...");
}


const add = async (req, res) => {  
    res.render('dashboard')
}




/// helper functions
async function getTickerData(userId, ticker) {
    // fetch current stock info
    const response = await axios.get("https://finnhub.io/api/v1/quote", {
        params: {
            symbol: ticker.toUpperCase(),
            token: process.env.FINHUB_API_KEY
        }
    });

    if (!response.data || (response.data.c === 0 && response.data.t === 0)) {
        throw new Error("Invalid or unknown stock symbol");
    }

    // fetch the bought stock record
    const boughtStock = await Stocks.findOne({
        where: { userId, ticker }
    });

    if (!boughtStock) {
        throw new Error("User has not bought this stock");
    }

    let boughtStockPrice = boughtStock.priceBought;
    let boughtAmount = boughtStock.amount;
    let currStockPrice = response.data.c;

    // calc stats
    let percentageChange = ((currStockPrice - boughtStockPrice) / boughtStockPrice) * 100;
    let returns = (currStockPrice - boughtStockPrice) * boughtAmount;

    return { percentageChange, returns, currStockPrice, boughtStockPrice };
}

const chatBot = async (req, res) => {
    try {
        const { message } = req.body;
        console.log("message -------------> " , message)

        if (!message) return res.status(400).json({ error: "Message is required" });

        const response = await client.chat({
        model: "gemini-2.5",
        messages: [{ role: "user", content: message }],
        });

        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error communicating with Gemini API" });
    }
}


module.exports = { 
    getPortfolio,
    getTicker,
    addTicker,
    deleteTicker,
    updateVolumeOfTicker,
    add,
    chatBot
    };



