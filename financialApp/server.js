const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', {
    balance: 1500,
    transactions: [{title: 'jedzenie', category: 'spozywcze', type: 'expense'}],
  })
});





app.listen(3000, () => console.log("Server running on http://localhost:3000"));