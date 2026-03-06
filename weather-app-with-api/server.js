require('dotenv').config();

const axios = require('axios');
const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index', { weatherData: null, error: null });
});

app.post('/weather', async (req, res) => {
  const requestedCity = req.body.city;
  const apiKey = process.env.WEATHER_API_KEY;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${requestedCity}&appid=${apiKey}&units=metric`;

  try {
    const resopnse = await axios.get(apiUrl);
    const weather = resopnse.data;
    console.log(weather);

    res.render('index', { weatherData: weather, error: null });
  } catch (err) {
    console.log("THE REAL ERROR IS:", err.response ? err.response.data : err.message);
    res.render('index', { weatherData: null, error: 'Error with connecting api.' });
  }
});

const myFavoriteMovies = [
  { id: 1, title: "The Matrix", year: 1999 },
  { id: 2, title: "Interstellar", year: 2014 },
  { id: 3, title: "Dune", year: 2021 }
];

app.get('/api/movies', (req, res) => {
  res.json({
    success: true,
    totalMovies: myFavoriteMovies.length,
    movies: myFavoriteMovies
  });
});

app.post('/api/movies', (req, res) => {
  const newMovieTitle = req.body.title;

  const newMovieObject = {
    id: myFavoriteMovies.length + 1,
    title: newMovieTitle,
    year: 2026
  };

  myFavoriteMovies.push(newMovieObject);

  res.json({
    success: true,
    message: `Successfully added ${newMovieTitle}!`,
    currentMovies: myFavoriteMovies
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});