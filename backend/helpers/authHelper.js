const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { sentOtp, verifyOtp } = require("../utils/twillio");
const RefreshToken = require("../models/refreshTokenModel");

//  @desc       To set accessToken and refreshToken in cookies
const setCookie = async ({ id, accessToken, refreshToken, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !accessToken || !type) {
        return reject({
          msg: `Argument missing`,
          statusCode: 401,
        });
      }
      if (type === "userToken") {
        await RefreshToken.create({
          refreshToken,
          userId: id,
          expireAt: new Date(Date.now() + 31536000000),
        });
        // res
        //   .status(200)
        //   .cookie("accessToken", accessToken, {
        //     expires: new Date(Date.now() + 86400000),
        //     sameSite: "strict",
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production" ? true : false,
        //   })
        //   .cookie("authSession", true, {
        //     expires: new Date(Date.now() + 86400000),
        //   })
        //   .cookie("refreshToken", refreshToken, {
        //     expires: new Date(Date.now() + 31536000000),
        //     sameSite: "strict",
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production" ? true : false,
        //   })
        //   .cookie("refreshTokenID", true, {
        //     expires: new Date(Date.now() + 31536000000),
        //   })

        return resolve({
          msg: "Device Verified",
        });
      }

      if (type === "accessToken") {
        // res
        //   .status(200)
        //   .cookie("accessToken", accessToken, {
        //     expires: new Date(Date.now() + 86400000),
        //     sameSite: "strict",
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production" ? true : false,
        //   })
        //   .cookie("authSession", true, {
        //     expires: new Date(Date.now() + 86400000),
        //   })
        return resolve({
          msg: "New Access Token created",
        });
      }
    } catch (error) {
      return resolve({
        msg: error.message,
      });
    }
  });
};

//  @desc           For Login
const doLogin = ({ mobile, TwoStep }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!mobile) {
        return reject({
          msg: `Please provide an mobile`,
        });
      }

      const userFound = await User.findOne({ mobile });

      if (!userFound) {
        const user = await User.create({ mobile });

        return resolve({
          data: {
            msg: `Device Verified`,
            accountType: user.accounts.type,
          },
        });
      }
      if (userFound.length !== 0 && userFound.accounts.status === "Blocked") {
        return reject({
          data: {
            msg: `Yours account is Blocked for Spam Reports`,
          },
        });
      }
      if (userFound && !userFound.userName) {
        return resolve({
          data: {
            msg: `Device Verified`,
            accountType: `New Account`,
          },
        });
      }

      if (userFound.accounts.type === "Old Account" && userFound.userName) {
        if (
          userFound.accounts.type === "Old Account" &&
          userFound.TwoStepVerification.status === true &&
          !TwoStep
        ) {
          return resolve({
            data: {
              msg: `Device Verified`,
              accountType: userFound.accounts.type,
              TwoStepVerification: userFound.TwoStepVerification.status,
            },
          });
        } else {
          userFound.lastSync = new Date().toLocaleString();

          let user = await userFound.save();

          const accessToken = userFound.getAccessToken();
          // const refreshToken = userFound.getRefreshToken();

          return resolve({
            data: {
              msg: `Device Verified`,
              accountType: user.accounts.type,
              TwoStepVerification: user.TwoStepVerification.status,
              token: accessToken,
            },
          });

          // setCookie({
          //   id: user._id,
          //   accessToken,
          //   refreshToken,
          //   type: "userToken",
          // })
          //   .then(({ msg }) => {
          //     return resolve({
          //       data: {
          //         msg: msg || `Try again!!`,
          //         accountType: user.accounts.type,
          //         TwoStepVerification: user.TwoStepVerification.status,
          //         token: accessToken,
          //         refreshToken, // For temp
          //       },
          //     });
          //   })
          //   .catch(({ msg }) => {
          //     return reject({
          //       success: false,
          //       msg,
          //     });
          //   });
        }
      }
    } catch (error) {
      console.log(error.message);
      return reject({
        msg: error.message,
      });
    }
  });
};

//  @event name    sent-otp
//  @desc           Sent a OTP request
exports.sentOtp = ({ mobile, channel }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!mobile) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `Please provide an mobile`,
        });
      }
      sentOtp(mobile, channel)
        .then(({ data }) => {
          return resolve({ success: true, data });
        })
        .catch(({ msg }) => {
          return reject({ success: false, statusCode: 400, msg });
        });
    } catch (error) {
      reject({ success: false, statusCode: 400, msg: error.message });
    }
  });
};

//  @event name    verify-otp
//  @desc           To verify a OTP request and throw to doLogin func
exports.verifyOTP = ({ mobile, code }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!mobile || !code) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `Please provide an mobile and OTP code`,
        });
      }
      verifyOtp(mobile, code)
        .then((data) => {
          doLogin(data)
            .then(({ data }) => {
              return resolve({
                success: true,
                data,
              });
            })
            .catch(({ msg }) => {
              return reject({
                success: false,
                statusCode: 400,
                msg: `${msg || "Try again!!"}`,
              });
            });
        })
        .catch(({ msg }) => {
          return reject({ success: false, msg, statusCode: 400 });
        });
    } catch (error) {
      reject({ success: false, statusCode: 400, msg: error.message });
    }
  });
};

//  @event name    login-profile
//  @desc           To set a username for new account and throw doLogin func
exports.loginProfile = ({ name, userName, profilePic, mobile }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!mobile || !userName || !name) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `Please provide an mobile`,
        });
      }

      const userFound = await User.findOne({ mobile });

      if (!userFound) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `User not found`,
        });
      }

      if (profilePic) {
        userFound.profilePic = profilePic;
      }

      userFound.name = name;
      userFound.userName = userName;
      userFound.accounts.type = "Old Account";
      userFound.logs.lastSync = new Date().toLocaleString();
      userFound.userStatus = "";

      let user = await userFound.save();

      doLogin({ mobile: user.mobile })
        .then(({ data }) => {
          return resolve({
            success: true,
            data,
          });
        })
        .catch(({ msg }) => {
          return reject({ success: false, statusCode: 400, msg });
        });
    } catch (error) {
      reject({ success: false, statusCode: 400, msg: error.message });
    }
  });
};

//  @event name    cloud-password
//  @desc           Cloud Password for TwoStepVerification account and throw doLogin func
exports.cloudPassword = ({ mobile, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!mobile || !password) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `Please provide an mobile and password`,
        });
      }

      const userFound = await User.findOne({ mobile }).select(
        "+TwoStepVerification.password"
      );

      if (!userFound) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `User not found`,
        });
      }

      const isMatch = await userFound.matchPasswords(password);

      if (!isMatch) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `Invalid Credentials`,
        });
      }
      doLogin({ mobile: userFound.mobile, TwoStep: true })
        .then(({ data }) => {
          return resolve({
            success: true,
            data,
          });
        })
        .catch(({ msg }) => {
          return reject({
            success: false,
            statusCode: 400,
            msg,
          });
        });
    } catch (error) {
      reject({ success: false, statusCode: 400, msg: error.message });
    }
  });
};

//  @event name    forget-password
//  @desc           Cloud Password for TwoStepVerification account and throw doLogin func
exports.forgetPasswod = ({ email }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!email) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `Please provide an email`,
        });
      }
      const userFound = await User.findOne({ email });

      if (!userFound) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `User Not Found`,
        });
      }

      userFound.TwoStepVerification.resetPasswdAccess = true;
      userFound.save();

      const token = userFound.getResetToken();

      const url = `${process.env.CLIENT_URL}/reset-passwd/${token}`;

      console.log(token);

      return resolve({
        success: true,
        data: {
          msg: `Sent Email Successfully`,
          url,
        },
      });
    } catch (error) {
      reject({ success: false, statusCode: 400, msg: error.message });
    }
  });
};

//  @event name    reset-password
//  @desc           Reset Password for TwoStepVerification account and throw doLogin func
exports.resetPassword = ({ password, token }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token || !password) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `Please provide an token and password`,
        });
      }
      const decoded = await jwt.verify(token, process.env.JWT_REFRESH);

      const userFound = await User.findOne({ _id: decoded.id }).select(
        "+TwoStepVerification.password"
      );

      if (!userFound || !userFound.TwoStepVerification.resetPasswdAccess) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `Authentication Failed, Try again!!`,
        });
      }

      userFound.TwoStepVerification.password = password;
      userFound.TwoStepVerification.resetPasswdAccess = false;
      userFound.logs.lastResetPasswd = new Date().toLocaleString();

      userFound.save();

      return resolve({
        success: true,
        data: {
          msg: `Cloud password reset successfully`,
        },
      });
    } catch (error) {
      reject({ success: false, statusCode: 400, msg: error.message });
    }
  });
};

//  @event name    refresh-token
//  @desc           Reset Password for TwoStepVerification account and throw doLogin func
exports.upgradeAccessToken = ({ refreshToken }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!refreshToken) {
        return reject({
          success: false,
          statusCode: 401,
          msg: `Refresh token not found, Please login again`,
        });
      }
      let dbRefreshToken = await RefreshToken.findOne({ refreshToken });

      if (!dbRefreshToken) {
        return reject({
          success: false,
          statusCode: 403,
          msg: `Refresh Token Blocked, login Again`,
        });
      }

      let { refreshToken, expireAt } = dbRefreshToken;

      if (new Date() > expireAt) {
        await RefreshToken.deleteMany({ refreshToken });
        return reject({
          success: false,
          statusCode: 403,
          msg: `Authentication Failed Login Again`,
        });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
        (err, decoded) => {
          if (err) {
            return reject({
              success: false,
              statusCode: 403,
              msg: `Invalid Refresh Token`,
            });
          }

          const accessToken = jwt.sign(
            { _id: decoded.id },
            process.env.JWT_ACCESS_SECRET,
            {
              expiresIn: process.env.ACCESS_TOKEN_DURATION,
            }
          );

          setCookie({ id: decoded.id, accessToken, type: "accessToken" })
            .then(({ msg }) => {
              return resolve({
                success: true,
                data: {
                  previousSessionExpiry: true,
                  msg,
                },
              });
            })
            .catch(({ msg }) => {
              return reject({
                success: false,
                msg,
              });
            });
        }
      );
    } catch (error) {
      reject({ success: false, statusCode: 400, msg: error.message });
    }
  });
};
