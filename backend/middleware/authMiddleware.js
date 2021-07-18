const jwt = require("jsonwebtoken");
const logger = require("../config/logger");
const User = require("../models/userModel");
const { accessToken } = require("../config/default").server.token;
const { ObjectId } = require("mongoose").Types;

const NAMESPACES = "AuthMiddleware";

exports.authorization = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || null;

    if (!token) {
      return next(new Error("Token Not Found"));
    }

    const decoded = jwt.verify(token, accessToken.secret);

    const user = await User.aggregate([
      {
        $match: { _id: ObjectId(decoded.id) },
      },
      {
        $project: {
          name: 1,
          userName: 1,
          mobile: 1,
          profilePic: 1,
          email: 1,
          accountStatus: "$accounts.status",
        },
      },
    ]);

    if (!user) {
      return next(new Error("Unauthorized event"));
    }

    if (user.length !== 0 && user[0].accountStatus === "Blocked") {
      return next(new Error(`Yours account is Blocked for Spam Reports`));
    }

    socket.user = user[0];

    next();
  } catch (error) {
    logger.error(NAMESPACES, error.message, error);
    return next(new Error("Unauthorized event"));
  }
};
