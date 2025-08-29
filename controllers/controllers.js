const transactionLog = require('../models/transactions')

// fetch all tickers
const getPortfolio = async (req, res) => { 
    allStockData = []

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

        console.log(allStockData)
    }
        catch (error) {
            res.status(500).json({ message: 'Failed fetching stocks' });
    }
    res.render('dashboard', {data : "additional data"})
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


module.exports = { 
    getPortfolio,
    getTicker,
    addTicker,
    deleteTicker,
    updateVolumeOfTicker,
    };



module.exports = {getTicker}
