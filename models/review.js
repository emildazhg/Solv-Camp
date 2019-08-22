const mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
  review: String,
  author: String,
  rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);
