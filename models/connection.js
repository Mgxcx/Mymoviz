var mongoose = require("mongoose");

var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(
  "mongodb+srv://Mgxcx:hello@cluster0.jxvvx.mongodb.net/Mymoviz?retryWrites=true&w=majority",
  options,
  function (err) {
    console.log(err);
  }
);
