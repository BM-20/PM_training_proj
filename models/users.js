const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connectToDB');

const Users = sequelize.define("Users", {
    id: 
    {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstname: 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    username : 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    password : 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    stocks: 
    {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    }

});

module.exports = Users;