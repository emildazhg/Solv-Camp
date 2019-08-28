const express = require("express"),
  router = express.Router(),
  User = require("../models/user"),
  passport = require("passport");

router.get("/", (req, res) => {
  res.redirect("/books");
});

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post("/register", (req, res) => {
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

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/books",
    failureRedirect: "/login"
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/books");
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

module.exports = router;
