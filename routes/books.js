const express = require("express"),
  router = express.Router(),
  Book = require("../models/book"),
  middleware = require("../middleware");

router.get("/", (req, res) => {
  Book.find({}, (err, data) => {
    err
      ? req.flash("error", "something went wrong")
      : res.render("book/index", { data: data, user: req.user });
  });
});

router.post("/", (req, res) => {
  Book.create(req.body.book, (err, book) => {
    if (err) {
      req.flash("error", "failed to create new book");
    } else {
      book.author.id = req.user._id;
      book.author.username = req.user.username;
      book.save();

      req.flash("success", `You just created ${book.title}`);
      res.redirect("/books");
    }
  });
});

router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render("book/add");
});

router.get("/:id", (req, res) => {
  Book.findById(req.params.id)
    .populate("reviews")
    .exec((err, data) => {
      err ? req.flash("error", "book not found") : res.render("book/book", { data: data });
    });
});

router.get("/:id/edit", middleware.checkBooksOwnership, (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    res.render("book/edit", { book: book });
  });
});

router.put("/:id", (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body.book, (err, book) => {
    if (err) {
      res.redirect("/books")
    } else {
      req.flash("success", `You updated ${book.title}`);
      res.redirect(`/books/${req.params.id}`)
    }
  })
})


router.delete("/:id", middleware.checkBooksOwnership, (req, res) => {
  Book.findByIdAndRemove(req.params.id, (err, book) => {
    if (err) {
      res.redirect("/books")
    } else {
      req.flash("success", `You delete ${book.title}`);
      res.redirect("/books")
    }
  })
})


module.exports = router;
