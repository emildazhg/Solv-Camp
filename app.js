const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  seedDB = require("./seeds"),
  passport = require("passport"),
  localStrategry = require("passport-local").Strategy,
  Book = require("./models/book"),
  Review = require("./models/review"),
  User = require("./models/user");

seedDB();

mongoose.connect("mongodb://localhost/solv_book", {
  useNewUrlParser: true,
  useCreateIndex: true
});

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

//passport
app.use(
  require("express-session")({
    secret: "This is just some fun exercise",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

passport.use(new localStrategry(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//User
app.get("/register", (req, res) => {
  res.render("user/register");
});

app.post("/register", (req, res) => {
  const newUser = new User({
    username: req.body.username
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("user/register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/books");
      });
    }
  });
});

app.get("/login", (req, res) => {
  res.render("user/login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login"
  })
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/books");
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

//books
app.get("/", (req, res) => {
  res.redirect("/books");
});

app.get("/books", (req, res) => {
  Book.find({}, (err, data) => {
    err
      ? console.log(err)
      : res.render("book/index", { data: data, user: req.user });
  });
});

app.post("/books", isLoggedIn, (req, res) => {
  Book.create(req.body.book, err => {
    err ? console.log(err) : res.redirect("/books");
  });
});

app.get("/books/new", isLoggedIn, (req, res) => {
  res.render("book/addBook");
});

app.get("/books/:id", (req, res) => {
  Book.findById(req.params.id)
    .populate("reviews")
    .exec((err, data) => {
      err ? console.log(err) : res.render("book/book", { data: data });
    });
});

app.get("/books/:id/review/new", isLoggedIn, (req, res) => {
  Book.findById(req.params.id, (err, data) => {
    err ? console.log(err) : res.render("review/addReview", { data: data });
  });
});

app.post("/books/:id/review", isLoggedIn, (req, res) => {
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
