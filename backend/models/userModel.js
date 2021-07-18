const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token, webAppName } = require("../config/default").server;

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
  userStatus: {
    type: String,
    require: true,
  },
  profilePic: {
    type: String,
  },
  userAbout: {
    type: String,
    require: true,
    default: `Hey there! I am using ${webAppName}`,
  },
  accounts: {
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
  },

  TwoStepVerification: {
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
  },

  logs: {
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
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("TwoStepVerification.password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.TwoStepVerification.password = await bcrypt.hash(
    this.TwoStepVerification.password,
    salt
  );
  next();
});

userSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.TwoStepVerification.password);
};

userSchema.methods.getAccessToken = function () {
  return jwt.sign({ id: this._id }, token.accessToken.secret, {
    expiresIn: token.accessToken.expires,
  });
};

userSchema.methods.getRefreshToken = function () {
  return jwt.sign({ id: this._id }, token.refreshToken.secret, {
    expiresIn: token.refreshToken.expires,
  });
};

userSchema.methods.getResetToken = function () {
  return jwt.sign({ id: this._id }, token.resetToken.secret, {
    expiresIn: token.resetToken.expires,
  });
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
