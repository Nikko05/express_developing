const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "You must provide a title!"],
    trim: true
  },
  year: {
    type: Number,
    min: [1888, "Movies didn't exist before 1888!"],
    max: [new Date().getFullYear() + 5, "That movie is too far in the future!"]
  },
  genre: {
    type: String,
    enum: ["Sci-Fi", "Action", "Drama", "Comedy", "Horror"],
    default: "Drama"
  }
});

module.exports = mongoose.model('Movie', movieSchema);