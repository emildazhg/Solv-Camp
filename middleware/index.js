const Book = require("../models/book"),
  Review = require("../models/review");

var middlewareObject = {};

middlewareObject.checkBooksOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Book.findById(req.params.id, (err, book) => {
      if (err) {
        req.flash("error", "Book not found!");
        res.redirect("back");
      } else {
        if (book.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("back")
  }
}

middlewareObject.checkReviewOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Review.findById(req.params.review_id, (err, review) => {
      if (err) {
        req.flash("error", "Review not found!");
        res.redirect("back");
      } else {
        if (review.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You don't have permission to do that!");
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back")
  }
}

middlewareObject.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You need to be logged in to do that!");
  res.redirect("/login");
};

module.exports = middlewareObject