const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connectToDB');
const Portfolios = require('../models/portfolios')

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

module.exports = PortfolioHistory;
