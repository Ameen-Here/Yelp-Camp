const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");

const multer = require("multer");
const { storage } = require("../cloudinary/index.js");

const upload = multer({ storage });

const { isLoggedIn, isAuthor } = require("../middleware.js");

// Controller import
const campground = require("../controllers/campground.js");

// Index
router.get("/", catchAsync(campground.index));

// New camp
router
  .route("/new")
  .get(isLoggedIn, campground.renderNewForm)
  .post(isLoggedIn, upload.array("image"), campground.addCamp);

// catchAsync(campground.addCamp)
// Edit camp form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campground.renderEditForm)
);

// Edit camp, delete and update one info of camp
router
  .route("/:id")
  .get(catchAsync(campground.updateCamp))
  .delete(isLoggedIn, isAuthor, catchAsync(campground.deleteCamp))
  .put(
    isAuthor,
    isLoggedIn,
    upload.array("image"),
    catchAsync(campground.smUpdateCamp)
  );

module.exports = router;
