const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const ErrorResponse = require("../utils/errorResponse")

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.Authorization && req.headers.Authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return next(new ErrorResponse("Not authorized please login again", 401))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id)

        if(!user){
            return next(new ErrorResponse("Not authorized please login again",404))
        }

        req.user = user;

        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorized please login again",401))
    }
}