const express = require("express"),
  router = express.Router({ mergeParams: true }),
  Book = require("../models/book"),
  Review = require("../models/review"),
  middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, data) => {
    err ? req.flash("error", "something went wrong")
      : res.render("review/add", { data: data });
  });
});

router.post("/", middleware.isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      res.redirect("back");
    } else {
      Review.create(req.body.review, (err, review) => {
        if (err) {
          req.flash("error", "failed to create new review")
        } else {
          review.author.id = req.user._id;
          review.author.username = req.user.username;
          review.save();

          book.reviews.push(review);
          book.save();
          req.flash("success", `You just create new review!`);
          res.redirect(`/books/${book._id}`);
        }
      });
    }
  });
});


router.get("/:review_id/edit", middleware.checkReviewOwnership, (req, res) => {
  Review.findById(req.params.review_id, (err, review) => {
    if (err) {
      res.redirect("back")
    } else {
      res.render("review/edit", { data_id: req.params.id, review: review });
    }
  })
})

router.put("/:review_id", middleware.checkReviewOwnership, (req, res) => {
  Review.findByIdAndUpdate(req.params.review_id, req.body.review, (err, data) => {
    if (err) {
      res.redirect("back")
    } else {
      req.flash("success", `You just update your review!`);
      res.redirect(`/books/${req.params.id}`);
    }
  })
})

router.delete("/:review_id", middleware.checkReviewOwnership, (req, res) => {
  Review.findByIdAndRemove(req.params.review_id, (err, review) => {
    if (err) {
      res.redirect(`/books/${req.params.id}`)
    } else {
      req.flash("success", `You just delete your review!`);
      res.redirect(`/books/${req.params.id}`)
    }
  })
})

module.exports = router;
