const express = require("express"),
  router = express.Router(),
  Book = require("../models/book");

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const checkBooksOwnership = (req, res, next) => {
  if (req.isAuthenticated()) {
    Book.findById(req.params.id, (err, book) => {
      if (err) {
        res.redirect("back");
      } else {
        if (book.author.id.equals(req.user._id)) {
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

router.get("/", (req, res) => {
  Book.find({}, (err, data) => {
    err
      ? console.log(err)
      : res.render("book/index", { data: data, user: req.user });
  });
});

router.post("/", (req, res) => {
  Book.create(req.body.book, (err, book) => {
    if (err) {
      console.log(err);
    } else {
      book.author.id = req.user._id;
      book.author.username = req.user.username;
      book.save();

      res.redirect("/books");
    }
  });
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("book/add");
});

router.get("/:id", (req, res) => {
  Book.findById(req.params.id)
    .populate("reviews")
    .exec((err, data) => {
      err ? console.log(err) : res.render("book/book", { data: data });
    });
});

router.get("/:id/edit", checkBooksOwnership, (req, res) => {
  Book.findById(req.params.id, (err, book) => {
    res.render("book/edit", { book: book });
  });
});

router.put("/:id", (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body.book, (err, book) => {
    if (err) {
      console.log(err)
      res.redirect("/books")
    } else {
      res.redirect(`/books/${req.params.id}`)
    }
  })
})


router.delete("/:id", checkBooksOwnership, (req, res) => {
  Book.findByIdAndRemove(req.params.id, (err, book) => {
    if (err) {
      res.redirect("/books")
    } else {
      res.redirect("/books")
    }
  })
})


module.exports = router;
