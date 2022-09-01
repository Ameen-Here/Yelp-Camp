const User = require("../models/user.js");

// Render register user form
module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register.ejs");
};

// Register the user
module.exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({
      email,
      username,
    });
    const newUser = await User.register(user, password);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to YelpCamp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

// Render login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

// Login user
module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back!!!");
  const redirectTo = res.locals.returnTo || "/";
  res.locals.returnTo = "";
  res.redirect(redirectTo);
};

// Logout user
module.exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged out");
    res.redirect("/campgrounds");
  });
};
