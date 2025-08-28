var request = require('request');
const { Users, transactionLog } = require('../models/users');

// fetch all tickers
const getPortfolio = async (req, res) => {  

}

const getTicker = async (req, res) => {  
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

}

const deleteTicker = async (req, res) => {  

}

const updateVolumeOfTicker = async (req, res) => {  

}

module.exports = {getTicker}
