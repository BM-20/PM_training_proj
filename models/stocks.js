const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connectToDB');
const Users = require('../models/users')

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
    priceBought: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    priceSold: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,
            key: 'id'
        }
    }

});

module.exports = transactionLog;