const express = require('express');
const sequelize = require('./utils/connectToDB');
const path = require('path');
const app = express();
const portfolioRoutes = require('./routes/portfolioRoutes');
const expressEjsLayouts = require('express-ejs-layouts');
const cookieParser = require("cookie-parser");


require('dotenv').config();

// middleware
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(cookieParser());
app.use(express.static('public'))
app.use('/', portfolioRoutes);
/*
app.get("/", (req, res) => {
  res.send("Server is up and running ✅");
});
*/
// ejs setup
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(expressEjsLayouts)


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
