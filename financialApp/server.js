const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://mongodb:27017/financialApp')
  .then(() => {
    app.listen(3000, () => console.log("Server running"));
    console.log("Connected to MongoDB");
  })
  .catch(err => console.error("Connection error:", err));

const Transaction = mongoose.model("Transaction", new mongoose.Schema({
  title: String,
  amount: Number,
  type: String,
  category: String
}), 'transactions');

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let balance = 0;

app.get('/', async (req, res) => {
  balance = 0
  const allTransactions = await Transaction.find({});
  allTransactions.map(transaction => balance += transaction.type === 'expense' ? -transaction.amount : transaction.amount);

  res.render('index', {
    balance: balance,
    transactions: allTransactions,
  });
});

app.post('/add', async (req, res) => {
  try {
    const newTransaction = new Transaction({
      title: req.body.title,
      amount: req.body.amount,
      type: req.body.type,
      category: req.body.category
    });

    await newTransaction.save();
    res.redirect('/');
  }
  catch (err) {
    res.status(500).send('Error with connecting database.');
  }
});

app.post('/delete/:id', async (req, res) => {
  try {
    const removedTransaction = await Transaction.findByIdAndDelete(req.params.id);

    res.redirect('/');
  }
  catch (err) {
    res.status(500).send('Error with connecting database');
  }
});