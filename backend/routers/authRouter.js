const express = require("express");
const router = express.Router();
const {
    sentOtp,
    verifyOTP,
    refreshToken,
    loginProfile,
    cloudPassword,
    forgetCloudPasswd,
    resetCloudPasswd,
    logout,
} = require("../controller/authController");

router.route("/sent-otp").post(sentOtp);
router.route("/verify-otp").post(verifyOTP);
router.route("/login-profile").post(loginProfile);
router.route("/cloud-password").post(cloudPassword);
router.route("/forget-cloud-passwd").post(forgetCloudPasswd);
router.route("/reset-cloud-passwd").put(resetCloudPasswd);
router.route("/refresh-token").post(refreshToken);
router.route("/logout").put(logout);

module.exports = router;
