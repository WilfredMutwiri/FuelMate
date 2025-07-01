const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSignupSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNo: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetOtp: {
    type: Number,
    required: false,
  },
  otpExpires: {
    type: Date,
    required: false,
  },
});

const User = mongoose.model("User", userSignupSchema);
module.exports = User;
