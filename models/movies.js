var mongoose = require("mongoose");

var movieSchema = mongoose.Schema({
  name: String,
  src: String,
});

var movieModel = mongoose.model("movies", movieSchema);

module.exports = movieModel;
