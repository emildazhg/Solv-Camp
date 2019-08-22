const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  Book = require("./models/book"),
  Review = require("./models/review"),
  seedDB = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/solv_book", {
  useNewUrlParser: true
});

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/books");
});

app.get("/books", (req, res) => {
  Book.find({}, (err, data) => {
    err ? console.log(err) : res.render("book/index", { data: data });
  });
});

app.post("/books", (req, res) => {
  Book.create(req.body.book, err => {
    err ? console.log(err) : res.redirect("/books");
  });
});

app.get("/books/new", (req, res) => {
  res.render("book/addBook");
});

app.get("/books/:id", (req, res) => {
  Book.findById(req.params.id)
    .populate("reviews")
    .exec((err, data) => {
      err ? console.log(err) : res.render("book/book", { data: data });
    });
});

app.get("/books/:id/review/new", (req, res) => {
  Book.findById(req.params.id, (err, data) => {
    err ? console.log(err) : res.render("review/addReview", { data: data });
  });
});

app.post("/books/:id/review", (req, res) => {
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

app.listen(3000, () => console.log("Books Review App running in port 3000"));
