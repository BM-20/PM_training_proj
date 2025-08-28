const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connectToDB');
const Users = require('../models/users')

const Stocks = sequelize.define("Stocks", { 
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ticker: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    userId: {  
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Users,  
            key: "id"
        },
        onDelete: "CASCADE"   
    }
});


module.exports = Stocks;