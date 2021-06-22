const User = require("../models/userModel");

exports.setUserStatus = (user, status) => {
  if (status === "isOnline") {
    status = `online`;
  }

  if (status === "isOffline") {
    date = new Date().toLocaleString();
    status = `lastseen at ${date}`;
  }

  if (status === "isTyping") {
    status = `typing...`;
  }

  User.findOneAndUpdate({ _id: user._id }, { userStatus: status }, (err,doc) => {
    if (err) {
      console.log(error.message);
      // return next(new Error("Set Status Error"));
    }
  });
};

exports.getUser = async(user) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!user) {
        return reject({
          success: false,
          msg: `Unauthorized event`,
        });
      }

      return resolve({
        success: true,
        data: {
          user,
        },
      });
    } catch (error) {
      return reject({
        success: false,
        msg: `Unauthorized event`,
      });
    }
  });
};

//  @socket name    logout
//  @desc           To clear all cookies and remove refreshToken in db
//  @access         public
exports.logout = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // if (req.cookies.refreshToken) {
      //   let refreshToken = req.cookies.refreshToken;
      //   await RefreshToken.deleteMany({ refreshToken });
      // }
      // .clearCookie("accessToken")
      // .clearCookie("authSession")
      // .clearCookie("refreshToken")
      // .clearCookie("refreshTokenID")

      return resolve({
        success: true,
        data: {
          message: `Logout Successsfully`,
        },
      });
    } catch (error) {
      reject({ success: false, statusCode: 400, msg: error.message });
    }
  });
};
