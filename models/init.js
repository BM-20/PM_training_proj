const Users = require('./users');
const Portfolios = require('./portfolios');
const Stocks = require('./stocks');
const PortfolioHistory = require('./portfolioHistory');
const TransactionLog = require('./transactions');

// 🧑 Users ↔ Portfolios
Users.hasMany(Portfolios, { foreignKey: 'userId', onDelete: 'CASCADE' });
Portfolios.belongsTo(Users, { foreignKey: 'userId' });

// 📂 Portfolios ↔ Stocks
Portfolios.hasMany(Stocks, { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
Stocks.belongsTo(Portfolios, { foreignKey: 'portfolioId' });

// 📈 Portfolios ↔ PortfolioHistory
Portfolios.hasMany(PortfolioHistory, { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
PortfolioHistory.belongsTo(Portfolios, { foreignKey: 'portfolioId' });

// 🧾 Portfolios ↔ TransactionLog
Portfolios.hasMany(TransactionLog, { foreignKey: 'portfolioId', onDelete: 'CASCADE' });
TransactionLog.belongsTo(Portfolios, { foreignKey: 'portfolioId' });

module.exports = {
  Users,
  Portfolios,
  Stocks,
  PortfolioHistory,
  TransactionLog
};
