const express = require("express"),
  router = express.Router(),
  Book = require("../models/book");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

router.get("/", (req, res) => {
  Book.find({}, (err, data) => {
    err
      ? console.log(err)
      : res.render("book/index", { data: data, user: req.user });
  });
});

router.post("/", isLoggedIn, (req, res) => {
  Book.create(req.body.book, err => {
    err ? console.log(err) : res.redirect("/books");
  });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("book/addBook");
});

router.get("/:id", (req, res) => {
  Book.findById(req.params.id)
    .populate("reviews")
    .exec((err, data) => {
      err ? console.log(err) : res.render("book/book", { data: data });
    });
});

module.exports = router;
