const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/userModel");

//  @route      GET /api/user
//  @desc       To sent user data
//  @access     private
exports.findUser = asyncHandler(async (req, res, next) => {
    let user = req.user
    res.status(200).json({ user })
})
