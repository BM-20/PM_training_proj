const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connectToDB');

const Users = sequelize.define("Users", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    password: {
        type: DataTypes.STRING,
        allowNull: false
        
    },
    stocks: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }
});

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
module.exports = { Users, transactionLog };