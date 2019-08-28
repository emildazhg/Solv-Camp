const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  review: String,
  rating: Number,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Review", reviewSchema);
