var express = require("express");
var router = express.Router();
var request = require("sync-request");
var movieModel = require("../models/movies");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Mymoviz" });
});

router.get("/new-movies", function (req, res, next) {
  var movie = request(
    "GET",
    `https://api.themoviedb.org/3/discover/movie?api_key=a6ca7719dd729f27c0c3f8520b357638&language=fr&sort_by=popularity.desc&include_adult=false&include_video=false&primary_release_year=2020&vote_average.gte=7&vote_average.lte=9`
  );
  movie = JSON.parse(movie.body);

  res.json({ movie });
});

router.post("/wishlist-movie", async function (req, res, next) {
  var newMovie = new movieModel({
    name: req.body.name,
    src: req.body.src,
  });
  await newMovie.save();

  var result = false;
  if (newMovie.name) {
    result = true;
  }
  res.json({ result, newMovie });
});

router.delete("/wishlist-movie/:name", async function (req, res, next) {
  var deleteMovie = await movieModel.deleteOne({ name: req.params.name });

  var result = false;
  if (!deleteMovie.name) {
    result = true;
  }
  res.json({ result });
});

router.get("/wishlist-movie", async function (req, res, next) {
  var movieList = await movieModel.find();

  var result = false;
  if (movieList) {
    result = true;
  }
  res.json({ result, movieList });
});

module.exports = router;
