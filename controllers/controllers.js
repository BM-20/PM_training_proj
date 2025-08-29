const transactionLog = require('../models/transactions')

// fetch all tickers
const getPortfolio = async (req, res) => {  
    res.render('dashboard', {data : "additional data"})
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
                ticker : ticker },
            transaction: t
        });

        if (haveStockAlready) {
            await t.rollback();  
            return res.status(403).json({ message: "Stock already exists" });
        }

        // Add new stock to the users portfolio
        const newStock = await Stocks.create(
            { ticker, amount, userId },
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



module.exports = { 
    getPortfolio,
    getTicker,
    addTicker,
    deleteTicker,
    updateVolumeOfTicker,
    };



module.exports = {getTicker}
