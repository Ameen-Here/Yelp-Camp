const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync.js");

// Import review controller
const reviews = require("../controllers/reviews.js");

const { isLoggedIn, validateReview, isReviewId } = require("../middleware.js");

// Adding review
router.post(
  "/review",
  isLoggedIn,
  validateReview,
  catchAsync(reviews.createReview)
);

// Delete review
router.delete(
  "/reviews/:reviewId",
  isLoggedIn,
  isReviewId,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
