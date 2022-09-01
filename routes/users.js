const express = require("express");
const res = require("express/lib/response.js");
const router = express.Router();
const passport = require("passport");

// Import User controller
const users = require("../controllers/users.js");

const catchAsync = require("../utils/catchAsync.js");

// User registration
router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.registerUser));

// User login
router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

// User logout
router.get("/logout", users.logoutUser);

module.exports = router;
