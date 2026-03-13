const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Movie = require('./models/Movie');

const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Your database is working.'))
  .catch((err) => console.log('Error with connecting database.'));

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.get('/', async (req, res) => {
  try {
    const filter = {};

    req.query.year ? filter.year = req.query.year : null;
    req.query.genre ? filter.genre = req.query.genre : null;

    const movies = await Movie.find(filter);

    res.render('home', { movies: movies });
  } catch (err) {
    res.status(500).send('Error with database.');
  }
});

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const foundUser = findOne({ email });

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) res.status(400).send('Email or password is invalid.');

    res.redirect('/');
  } catch (err) {
    res.status(500).send('Error with login user.');
  }
})

app.post('/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({ name, email, password });

    await newUser.save();

    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error with adding user.');
  }
})

app.get('/movie/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    movie != null ? res.json(movie) : res.status(404).json({ error: "Cannot to find the movie with your ID." });

  } catch (err) {
    res.status(500).json({ error: 'Invalid ID format.' });
  }
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));