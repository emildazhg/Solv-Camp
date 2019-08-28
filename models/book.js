const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  title: String,
  image: String,
  description: String,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  }
});

module.exports = mongoose.model("Book", booksSchema);
