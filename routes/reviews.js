const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Book = require("../models/book"),
  Review = require("../models/review");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/new", isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, data) => {
    err ? console.log(err) : res.render("review/addReview", { data: data });
  });
});

router.post("/", isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      console.log(err);
      redirect("/books");
    } else {
      Review.create(req.body.review, (err, review) => {
        if (err) {
          console.log(err);
        } else {
          book.reviews.push(review);
          book.save();
          res.redirect("/books/" + book._id);
        }
      });
    }
  });
});

module.exports = router;
