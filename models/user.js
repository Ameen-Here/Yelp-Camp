const mongoose = require("mongoose");
const { Schema } = mongoose;
const passportLocalMongoose = require("passport-local-mongoose");

// Schema for users
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

// Add passport authentication
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
