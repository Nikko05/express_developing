const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Your database is working.'))
  .catch((err) => console.log('Error with connecting database.'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Movie API.' });
});

app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find();

    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: 'Error with database.' });
  }
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));