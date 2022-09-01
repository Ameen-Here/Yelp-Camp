module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => {
      if (err.kind === "ObjectId") {
        req.flash("error", "Can't find the campground :(");
        res.redirect("/campgrounds");
      } else {
        next();
      }
    });
  };
};
