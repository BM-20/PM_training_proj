const express = require('express');
const sequelize = require('./utils/connectToDB');
const app = express();
const portfolioRoutes = require('./routes/portfolioRoutes');

app.use(express.static("public"))
app.use(express.json());


require('dotenv').config();
app.use('/', portfolioRoutes);

// connecting to the database
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
