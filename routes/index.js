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
      req.flash("error", "User exist in out database!");
      res.redirect("back");
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
  req.flash("success", "You logout!");
  res.redirect("/books");
});


module.exports = router;
