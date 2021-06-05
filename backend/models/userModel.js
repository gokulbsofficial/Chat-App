const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const reqString = {
    type: String,
    required: true,
}

const accountScheme = mongoose.Schema({
  status: {
    type: String,
    required: true,
    default: "Active",
  },
  type: {
    type: String,
    required: true,
    default: "New Account",
  },
});

const TwoStepVerificationScheme = mongoose.Schema({
  status: {
    type: Boolean,
    default: false,
    required: true,
  },
  password: {
    type: String,
    select: false,
  },
  resetPasswdAccess: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const logsScheme = mongoose.Schema({
  createdAt: {
    type: String,
    required: true,
    default: new Date().toLocaleString(),
  },
  lastSync: {
    type: String,
    required: true,
    default: new Date().toLocaleString(),
  },
  lastResetPasswd: {
    type: String,
    required: false,
  },
});

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  userName: {
    type: String,
    lowercase: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
  },

  profilePic: {
    type: String,
  },
  accounts: [accountScheme],

  TwoStepVerification: [TwoStepVerificationScheme],

  logs: [logsScheme],
});

TwoStepVerificationScheme.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

TwoStepVerificationScheme.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1y",
  });
};

userSchema.methods.getRefreshtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH, {
    expiresIn: "1y",
  });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
