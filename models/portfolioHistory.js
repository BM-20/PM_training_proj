const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connectToDB');
const Users = require('../models/users')

const PortfolioHistory = sequelize.define("PortfolioHistory", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  totalValue: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
    
    userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Users,
                key: 'id'
            },
            onDelete: "CASCADE"
        }
});


module.exports = PortfolioHistory;