const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const User = require("../models/userModel");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshTokenModel");

//  @route      POST /api/auth/sent-otp
//  @desc       Sent a OTP request
//  @access     public
exports.sentOtp = asyncHandler(async (req, res, next) => {
    const mobile = req.body.mobile;
    const channel = req.body.channel || "sms";

    if (!mobile) {
        return next(new ErrorResponse("Please provide an mobile", 401));
    }

    try {
        client.verify
            .services(process.env.TWILIO_SERVICES_ID)
            .verifications.create({ to: `+${mobile}`, channel: channel })
            .then(async (verification) => {
                res.status(200).json({ status: true, sid: verification.sid, mobile });
            })
            .catch((error) => {
                console.log(error.message);
                console.log(error.code);
                return next(new ErrorResponse(error.message, 400, error.code));
            });
    } catch (error) {
        return next(new errorResponse(error.message, 400));
    }
});

//  @route      POST /api/auth/verify-otp
//  @desc       To verify a OTP request and throw to doLogin func
//  @access     public
exports.verifyOTP = asyncHandler(async (req, res, next) => {
    const mobile = req.body.mobile;
    const code = req.body.otp;

    if (!mobile || !code) {
        return next(
            new ErrorResponse(`Please provide an mobile and OTP code`, 401)
        );
    }

    try {
        client.verify
            .services(process.env.TWILIO_SERVICES_ID)
            .verificationChecks.create({ to: `+${mobile}`, code: code })
            .then(async (verification_check) => {

                if (verification_check.valid) {
                    let loginData = {
                        mobile,
                    };

                    doLogin(loginData, res, next);
                } else {
                    return next(new ErrorResponse(`Invalid OTP`, 400));
                }
            })
            .catch((error) => {
                console.log(error.message);
                console.log(error.code);
                return next(new ErrorResponse(error.message, 400, error.code));
            });
    } catch (error) {
        return next(new ErrorResponse(error.message, 401));
    }
});

//  @route      POST /api/auth/login-profile
//  @desc       To set a username for new account and throw doLogin func
//  @access     public
exports.loginProfile = asyncHandler(async (req, res, next) => {
    const { name, userName, profilePic, mobile } = req.body;

    if (!mobile || !userName || !name) {
        return next(new ErrorResponse("Please provide an name and username", 401));
    }

    try {
        const userFound = await User.findOne({ mobile });

        if (!userFound) {
            return next(new ErrorResponse("User not found", 401));
        }

        if (profilePic) {
            userFound.profilePic = profilePic;
        }

        userFound.name = name;
        userFound.userName = userName;
        userFound.accountType = "Old Account";
        userFound.lastSync = new Date().toLocaleString();

        let user = await userFound.save();

        let loginData = {
            mobile: user.mobile,
        };

        doLogin(loginData, res, next);

    } catch (error) {
        return next(new ErrorResponse(error.message, 401));
    }
});

//  @route      POST /api/auth/cloud-password
//  @desc       Cloud Password for TwoStepVerification account and throw doLogin func
//  @access     public
exports.cloudPassword = asyncHandler(async (req, res, next) => {
    const { mobile, password } = req.body;

    if (!password) {
        return next(new ErrorResponse("Please provide an cloud password", 401));
    }

    try {
        const userFound = await User.findOne({ mobile }).select("+cloudPassword");

        if (!userFound) {
            return next(new ErrorResponse("User not found", 401));
        }

        const isMatch = await userFound.matchPasswords(password);

        if (!isMatch) {
            return next(new ErrorResponse("Invalid Credentials", 401));
        }

        let loginData = {
            mobile: userFound.mobile,
            TwoStep: true,
        };

        doLogin(loginData, res, next, true);
    } catch (error) {
        return next(new ErrorResponse(error.message, 401));
    }
});

//  @route      POST /api/auth/forget-cloud-passwd
//  @desc       To sent email to reset token for TwoStepVerification account
//  @access     public
exports.forgetCloudPasswd = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    try {
        const userFound = await User.findOne({ email });

        if (!userFound) {
            return next(new ErrorResponse("User Not Found", 401));
        }

        userFound.resetCloudPasswd = true;
        userFound.save();

        const token = userFound.getRefreshtoken();

        const url = `${process.env.HOST_URL}/api/auth/reset-cloud-passwd/${token}`;

        console.log(token);

        res.status(200).json({ message: "Sent Email Successfully", url });
    } catch (error) {
        return next(new ErrorResponse(error.message, 401));
    }
});

//  @route      POST /api/auth/reset-cloud-passwd/
//  @desc       To verify reset token and  set new password then throw doLogin func
//  @access     public
exports.resetCloudPasswd = asyncHandler(async (req, res, next) => {
    const { password, token } = req.body;

    try {
        const decoded = await jwt.verify(token, process.env.JWT_REFRESH);

        const userFound = await User.findOne({ _id: decoded.id }).select(
            "+cloudPassword"
        );

        if (!userFound || !userFound.resetCloudPasswd) {
            return next(new ErrorResponse("Authentication Failed, Try again!!", 401));
        }

        userFound.cloudPassword = password;
        userFound.resetCloudPasswd = false;

        userFound.save();

        res.status(200).json({ message: "Cloud password reset successfully" });
    } catch (error) {
        return next(new ErrorResponse(error.message, 401));
    }
});

//  @route      POST /api/auth/refresh-token
//  @desc       To create refresh token and sent accesstoken
//  @access     public
exports.refreshToken = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(
            new ErrorResponse("Refresh token not found, Please login again", 403)
        );
    }

    try {
        let dbRefreshToken = await RefreshToken.findOne({ refreshToken });

        if (!dbRefreshToken) {
            return next(new ErrorResponse(`Refresh Token Blocked, login Again`, 403));
        }

        let { refreshToken, expireAt } = dbRefreshToken;

        if (new Date() > expireAt) {
            console.log("exp");
            await RefreshToken.deleteMany({ refreshToken });
            return next(new ErrorResponse(`Authentication Failed Login Again`, 403));
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, id) => {
            if (err) {
                return next(new ErrorResponse(`Invalid Refresh Token`, 403));
            }

            const accessToken = jwt.sign({ _id: id }, process.env.JWT_SECRET, {
                expiresIn: "30d",
            });
            let cookieData = {
                id: id.id,
                accessToken,
                type: "accessToken",
            };
            setCookie(cookieData, res, next);
        });
    } catch (error) {
        return next(new ErrorResponse(error.message, 403));
    }
});

//  @route      POST /api/auth/logout
//  @desc       To clear all cookies and remove refreshToken in db
//  @access     public
exports.logout = asyncHandler(async (req, res) => {
    if (req.cookies.refreshToken) {
        let refreshToken = req.cookies.refreshToken;
        await RefreshToken.deleteMany({ refreshToken });
    }

    res
        .clearCookie("accessToken")
        .clearCookie("authSession")
        .clearCookie("refreshToken")
        .clearCookie("refreshTokenID")
        .json({ status: true, message: `Logout Successsfully` });
});

// Functions
//  @desc       To Login for New User, Old user, Cloud passwd
const doLogin = asyncHandler(async (loginData, res, next) => {
    if (!loginData) {
        return next(new ErrorResponse("Please provide an mobile", 401));
    }

    try {
        let { mobile, TwoStep } = loginData;

        const userFound = await User.findOne({ mobile });

        if (!userFound) {
            const user = await User.create({ mobile });

            res.status(200).json({
                status: true,
                msg: "Device Verified",
                accountType: user.accountType,
            });
        }

        if (userFound.length !== 0 && userFound.status === "Blocked") {
            return next(
                new ErrorResponse("Yours account is Blocked for Spam Reports", 401)
            );
        }

        if (userFound && !userFound.userName) {
            res.status(200).json({
                status: true,
                msg: "Device Verified",
                accountType: "New Account",
            });
        }

        if (userFound.accountType === "Old Account" && userFound.userName) {
            if (
                userFound.accountType === "Old Account" &&
                userFound.TwoStepVerification === true &&
                !TwoStep
            ) {
                res.json({
                    status: true,
                    msg: "Device Verified",
                    accountType: userFound.accountType,
                    TwoStepVerification: userFound.TwoStepVerification,
                });
            } else {
                userFound.lastSync = new Date().toLocaleString();

                let user = await userFound.save();

                const accessToken = userFound.getSignedtoken();
                const refreshToken = userFound.getRefreshtoken();

                let cookieData = {
                    user,
                    accessToken,
                    refreshToken,
                    type: "userToken",
                };
                setCookie(cookieData, res, next);
            }
        }
    } catch (error) {
        return next(new ErrorResponse(error.message, 401));
    }
});

//  @desc       To set accessToken and refreshToken in cookies
const setCookie = asyncHandler(async (cookieData, res, next) => {
    if (!cookieData || !res || !next) {
        return next(new ErrorResponse("Argument missing", 401));
    }
    try {
        if (cookieData.type === "userToken") {
            let { user, accessToken, refreshToken } = cookieData;

            await RefreshToken.create({
                refreshToken: refreshToken,
                userId: user._id,
                expireAt: new Date(Date.now() + 31536000000),
            });
            res
                .status(200)
                .cookie("accessToken", accessToken, {
                    expires: new Date(Date.now() + 86400000),
                    sameSite: "strict",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" ? true : false,
                })
                .cookie("authSession", true, {
                    expires: new Date(Date.now() + 86400000),
                })
                .cookie("refreshToken", refreshToken, {
                    expires: new Date(Date.now() + 31536000000),
                    sameSite: "strict",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" ? true : false,
                })
                .cookie("refreshTokenID", true, {
                    expires: new Date(Date.now() + 31536000000),
                })
                .json({
                    status: true,
                    msg: "Device Verified",
                    accountType: user.accountType,
                    TwoStepVerification: user.TwoStepVerification,
                    token: accessToken,
                });
        }

        if (cookieData.type === "accessToken") {
            res
                .status(200)
                .cookie("accessToken", cookieData.accessToken, {
                    expires: new Date(Date.now() + 86400000),
                    sameSite: "strict",
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" ? true : false,
                })
                .cookie("authSession", true, {
                    expires: new Date(Date.now() + 86400000),
                })
                .json({ previousSessionExpiry: true, success: true });
        }
    } catch (error) {
        return next(new ErrorResponse(error.message, 401));
    }
});
