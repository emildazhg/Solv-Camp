const mongoose = require("mongoose");

var booksSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
});

module.exports = mongoose.model("Book", booksSchema);
