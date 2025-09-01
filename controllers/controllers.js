const axios = require('axios')
const cron = require("node-cron");
const ExcelJS = require("exceljs");
const sequelize = require('../utils/connectToDB');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const transactionLog = require('../models/transactions')
const Stocks = require('../models/stocks')
const Portfolios = require('../models/portfolios')
const historyPortfolio = require('../models/portfolioHistory')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const getPortfolio = async (req, res) => { 
    try {
        // fetch all the users portfolios
        const userId = req.user.id;

        // load portfolios with stocks
        const portfolios = await Portfolios.findAll({
            where: { userId },
            include: [{ model: Stocks }]
        });

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


// creates a new portfolio
const createPortfolio = async (req, res) => { 
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const portfolio = await Portfolios.create({ name, userId });
        res.status(201).json({
            portfolio
        });

        portfolioHistorySnapshot(portfolio.id)

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



// fetch all tickers
const getPortfolioStocks = async (req, res) => { 
    
    allStockData = []

    try {
        //getting stocks for a specific user
        const userId = req.user.id;
        const portfolio = await Portfolios.findByPk(req.params.stocks, {
            include: [{ model: Stocks}]
        });


        if (!portfolio) {
            return res.status(404).json({ 
                message : "Portfolio not found"
            });
        }

        for (const stock of portfolio.Stocks) {
            let data = await getTickerData(req.params.stocks, stock.dataValues.ticker);

            let stockInfo = {
                ...data,
                ...stock.dataValues
            }

            allStockData.push(stockInfo)
        }

        //fetch portfolio history
        let response = await historyPortfolio.findAll({
            where :{portfolioId : portfolio.id}
        })

        const portfolioHistory = response.map(record => ({
            date: record.dataValues.date.toISOString().split('T')[0],  // Formats date as "YYYY-MM-DD"
            value: record.dataValues.totalValue
            }));


        portfolioData = {
            id : req.params.stocks
        }

        const transactions = await transactionLog.findAll({
            where: { portfolioId: portfolio.id },
            order: [['date', 'DESC']],  
            limit: 3                    
            });

        res.render('stocks', { 
            stocks: allStockData,
            portfolioHistory,
            portfolioData,
            transactions 

         })
    }
        catch (error) {
            res.status(500).json({ message: 'Failed fetching stocks' });
    }
    
}

const getTicker = async (req, res) => { 
    
    const { id : portfolioId, ticker } = req.params;
    const userId = req.user.id;

    // Get stock and portfolio info
    const stock = await Stocks.findOne({ 
        where: { 
            portfolioId,
            ticker 
        } 
    });
    const transactions = await transactionLog.findAll({ where: { portfolioId, ticker }, order: [['date','DESC']] });
    const liveData = await getTickerData(portfolioId, ticker);

    res.render('partials/expandStockModal', {
        portfolioId,
        stock: { 
            ...stock.dataValues, 
            ...liveData 
        },
        transactions
    });
}



const addTicker = async (req, res) => {

    let t;

    try {
        const portfolio = await Portfolios.findByPk(req.params.id)

        if (!portfolio) {
            return res.status(404).json({ 
                message : "Portfolio not found"
            });
        }

        const { ticker, amount } = req.body;

        if (!ticker || !amount ) {
            return res.status(400).json({
                message: "Ticker, date and amount are required"
            });
        }

        t = await sequelize.transaction(); // Initialize `t` inside try block

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
                portfolioId : req.params.id, 
                ticker : ticker,
            },
            transaction: t
        });

        if (haveStockAlready) {
            await t.rollback();  
            return res.status(403).json({ message: "Stock already exists" });
        }

        // Add new stock to the user's portfolio
        const newStock = await Stocks.create(
            { ticker, amount, priceBought, portfolioId: req.params.id }, 
            { transaction: t }
        );

        console.log(`ticker ${ticker}, price ${priceBought}, amount ${amount}, port ${req.params.id}, `)

        // Log the transaction information
        const newTransaction = await transactionLog.create(
            {
                date: new Date(),
                ticker,
                price: priceBought,
                amount,
                portfolioId: req.params.id
            },
            { transaction: t }
        );

        await t.commit();
        await portfolioHistorySnapshot(portfolio.id);

        return res.status(201).json({
            message: "New stock added and transaction logged",
            transaction: newTransaction
        });

    } catch (error) {
        if (t) {
            await t.rollback(); 
        }
        console.error(error);
        return res.status(500).json({ message: "Error adding ticker", error });
    }
};


// deletes ticker from user portfolio
const deleteTicker = async (req, res) => { 
    const ticker =  req.params.ticker 
}



const updateVolumeOfTicker = async (req, res) => {  
    
  const { id: portfolioId, ticker } = req.params;
  const userId = req.user.id;

  // positive = buy, negative = sell
  const rawAmount = req.body.amount ?? req.body; 
  const amount = parseFloat(rawAmount);

  if (!Number.isFinite(amount) || amount === 0) {
    return res.status(400).json({ message: "Invalid 'amount' — must be a non-zero number" });
  }


  let t;

  try {
    t = await sequelize.transaction();

    // Fetch current stock info
    const response = await axios.get("https://finnhub.io/api/v1/quote", {
      params: {
        symbol: ticker.toUpperCase(),
        token: process.env.FINHUB_API_KEY
      }
    });

    if (!response.data || (response.data.c === 0 && response.data.t === 0)) {
      await t.rollback();
      return res.status(404).json({ message: "Invalid or unknown stock symbol" });
    }

    const currentPrice = response.data.c;

    let stock = await Stocks.findOne({
      where: { portfolioId, ticker },
      transaction: t
    });

    if (!stock) {
      if (amount <= 0) {
        await t.rollback();
        return res.status(400).json({ message: "Cannot sell shares you don't own" });
      }
    } 
    else {
      // Update existing stock
      if (amount > 0) {

        // BUY so recalc avg cost
        const newAmount = stock.amount + amount;
        const newAvg = ((stock.amount * stock.priceBought) + (amount * currentPrice)) / newAmount;

        await stock.update({
            amount: newAmount,
            priceBought: newAvg
            }, { transaction: t });

      } 
      else 
        {
        // SELL theredore reduce shares, avg stays same
        if (stock.amount + amount < 0) {
          await t.rollback();
          return res.status(400).json({ message: "Not enough shares to sell" });
        }

        // if sold off all remaining shares
        else if (stock.amount + amount === 0) {
            await stock.destroy({ transaction: t });
        }

        else
        {
            await stock.update({
          amount: stock.amount + amount
        }, { transaction: t });
        }

        
      }
    }

    // Log the transaction
    await transactionLog.create({
        date: new Date(),
        ticker,
        price: currentPrice,
        amount, 
        portfolioId
        }, { transaction: t });

    await t.commit();


    //update profile history
    await portfolioHistorySnapshot(portfolioId);

    res.redirect(`/portfolio/${portfolioId}`)

  } catch (error) {
    if (t) await t.rollback();
    console.error(error);
    return res.status(500).json({ message: "Error updating ticker", error });
  }
};



/// helper functions
async function getTickerData(portfolioId, ticker) {

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
        where: { portfolioId, ticker }
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

const deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;        
        const userId = req.user.id;        

        const portfolio = await Portfolios.findOne({
        where: { id, userId },
        });

        if (!portfolio) {
        return res.status(404).json({ success: false, message: "Portfolio not found" });
        }

        await portfolio.destroy();
        return res.json({ success: true, portfolioId: id });

    } catch (err) {
        console.error(" Error deleting:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

const chatBot = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // pick a model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // start chat session
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "From now on, speak like a financial advisor, giving structured investment insights with pros/cons." }],
        },
        {
          role: "model",
          parts: [{ text: "Hi! How can I help you today?" }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    res.json({ reply });
  }
   catch (err) 
   {
    console.error(err);
    res.status(500).json({ error: "Error communicating with Gemini API" });
  }
};

async function portfolioHistorySnapshot (portfolioId) {
    
    try {
        // Calculate total value of portfolio
        const allStocks = await Stocks.findAll({ where: { portfolioId } });
        let totalValue = 0;

        for (let s of allStocks) {
            let { currStockPrice } = await getTickerData(portfolioId, s.ticker);
            totalValue += s.amount * currStockPrice;
        }

        // Save snapshot to history
        await historyPortfolio.create({
            portfolioId,
            totalValue
        });
        
    } catch (error) {
        
        console.error(error)
    }   
}

cron.schedule("0 * * * *", async () => {  // every weekday at 22:00

    // gett all the portfolios
    const portfolios = await Portfolios.findAll();
    
    for (let portfolio of portfolios) {
        await portfolioHistorySnapshot(portfolio.id);
    }

    console.log("Updated Portfolio History Logs");
    });


// GET /transactions/download/:portfolioId
const downloadTransactionData = async (req, res) => {
  try {
    const { id : portfolioId } = req.params;

    // Fetch ALL transactions
    const transactions = await transactionLog.findAll({
      where: { portfolioId },
      order: [['date', 'DESC']]
    });

    // Create workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    // Define columns
    worksheet.columns = [
      { header: "Date", key: "date", width: 15 },
      { header: "Ticker", key: "ticker", width: 15 },
      { header: "Amount", key: "amount", width: 10 },
      { header: "Price", key: "price", width: 10 }
    ];

    // Add rows
    transactions.forEach(t => {
      worksheet.addRow({
        date: t.date.toISOString().slice(0, 10),
        ticker: t.ticker,
        amount: t.amount,
        price: t.price
      });
    });

    // Send as file
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=transactions_portfolio_${portfolioId}.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating Excel");
  }
};


module.exports = { 
    getPortfolio,
    getPortfolioStocks,
    getTicker,
    addTicker,
    deleteTicker,
    updateVolumeOfTicker,
    chatBot,
    createPortfolio,
    downloadTransactionData,
    deletePortfolio
    };



