if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// Express
const express = require("express");
const app = express();

// Express routes
const campgroundRoutes = require("./routes/campground.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/users.js");

// Export mongoose
const mongoose = require("mongoose");

// Export sessiom
const session = require("express-session");

// Export flash
const flash = require("connect-flash");

// Sanitize mongo
const mongoSanitise = require("express-mongo-sanitize");

// Export middleware and engines
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// Export passport and dependencies
const passport = require("passport");
const LocalStrategy = require("passport-local");

// Export custom class
const { redirect } = require("express/lib/response");

const ExpressError = require("./utils/ExpressError.js");

const User = require("./models/user.js");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";
const mainSecret = process.env.SECRET || "Thisisanothersecret";

//  Set ejs engine, path and current view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// Connect middleware with app
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(mongoSanitise());

const MongoDBStore = require("connect-mongo")(session);

const store = new MongoDBStore({
  url: dbUrl,
  secret: mainSecret,
  touchAfter: 24 * 60 * 3600,
});

store.on("error", function (e) {
  console.log("Session store error", e);
});

// Session and flash middleware
const sessionConfig = {
  store,
  name: "session",
  secret: mainSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    // secure:true,
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  Connect to mongoose

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//  Check db connection error/failure
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => console.log("Database Connected"));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.returnTo = req.session.returnTo;
  next();
});

// Demo passport route

app.get("/fakeLogin", async (req, res) => {
  const user = new User({
    email: "ameenair6@gmail.com",
    username: "armieneun",
  });
  const newUser = await User.register(user, "fakePassword");
  res.send(newUser);
});

//  RESTful routing
app.get("/", (req, res) => {
  res.render("home");
});

// Campground Routes
app.use("/campgrounds", campgroundRoutes);

app.use("/campgrounds/:id", reviewRoutes);

app.use("/", userRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not found", 404));
});

app.use((err, req, res, next) => {
  const { message = "something went wrong", statusCode = 500 } = err;
  res.status(statusCode).render("error.ejs", { err });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening to port ${port}`));
