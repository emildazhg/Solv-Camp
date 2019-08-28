const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: String,
  author: String,
  rating: Number
});

module.exports = mongoose.model("Review", reviewSchema);
