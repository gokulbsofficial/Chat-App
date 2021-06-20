const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { ObjectId } = require("mongoose").Types;

exports.authorization = async (socket, next) => {
  try {
    let { headers } = socket.handshake;

    const token = headers.authorization
      ? headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      return next(new Error("Token Not Found"));
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    const user = await User.aggregate([
      {
        $match: { _id: ObjectId(decoded.id) },
      },
      {
        $project: {
          userStatus: 0,
          accounts: 0,
          TwoStepVerification: 0,
          logs: 0,
          __v: 0,
        },
      },
    ]);

    if (!user) {
      return next(new Error("Unauthorized event"));
    }

    // if (user !== 0 && user.status === "Blocked") {
    //   return reject({
    //     data: {
    //       msg: `Yours account is Blocked for Spam Reports`,
    //     },
    //   });
    // }

    socket.user = user[0];

    next();
  } catch (error) {
    console.log(error.message);
    return next(new Error("Unauthorized event"));
  }
};
