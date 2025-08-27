const express = require('express');
const sequelize = require('./utils/connectToDB');
const app = express();

app.use(express.static("public"))
app.use(express.json());

require('dotenv').config();

app.get('/', (req, res) => {
  res.send('GET request to the homepage')
})

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
