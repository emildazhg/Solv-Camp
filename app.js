const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  seedDB = require("./seeds"),
  passport = require("passport"),
  localStrategry = require("passport-local").Strategy,
  User = require("./models/user");

const booksRoutes = require("./routes/books"),
  reviewsRoutes = require("./routes/reviews"),
  indexRoutes = require("./routes/index");

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

app.use("/books", booksRoutes);
app.use("/books/:id/review", reviewsRoutes);
app.use("/", indexRoutes);

app.listen(3000, () => console.log("Books Review App running in port 3000"));
