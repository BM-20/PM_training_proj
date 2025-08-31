const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connectToDB');
const Portfolios = require('../models/portfolios')

const transactionLog = sequelize.define("transactionLog", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    ticker: {
        type: DataTypes.STRING,
        allowNull: false 
    },
    // price of stock at time of the transaction
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // amount of stock being added or removed from their holdings
    amount: {
        type: DataTypes.FLOAT,
        allowNull: true
    },

    // TODO: change the reference to the portfolio id
    portfolioId: {  
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { 
            model: Portfolios, 
            key: "id" 
        },
        onDelete: "CASCADE"
    }
});

module.exports = transactionLog;