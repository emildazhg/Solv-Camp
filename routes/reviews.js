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

const checkReveiwOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Review.findById(req.params.review_id, (err, review) => {
      if (err) {
        res.redirect("back");
      } else {
        if (review.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back")
  }
}


router.get("/new", isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, data) => {
    err ? console.log(err) : res.render("review/add", { data: data });
  });
});

router.post("/", isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      Review.create(req.body.review, (err, review) => {
        if (err) {
          console.log(err);
        } else {
          review.author.id = req.user._id;
          review.author.username = req.user.username;
          review.save();

          book.reviews.push(review);
          book.save();
          res.redirect(`/books/${book._id}`);
        }
      });
    }
  });
});


router.get("/:review_id/edit", checkReveiwOwnership, (req, res) => {
  Review.findById(req.params.review_id, (err, review) => {
    if (err) {
      console.log(err);
      res.redirect("back")
    } else {
      res.render("review/edit", { data_id: req.params.id, review: review });
    }
  })
})

router.put("/:review_id", checkReveiwOwnership, (req, res) => {
  Review.findByIdAndUpdate(req.params.review_id, req.body.review, (err, data) => {
    if (err) {
      console.log(err);
      res.redirect("back")
    } else {
      res.redirect(`/books/${req.params.id}`);
    }
  })
})

router.delete("/:review_id", checkReveiwOwnership, (req, res) => {
  Review.findByIdAndRemove(req.params.review_id, (err, review) => {
    if (err) {
      res.redirect(`/books/${req.params.id}`)
    } else {
      res.redirect(`/books/${req.params.id}`)
    }
  })
})

module.exports = router;
