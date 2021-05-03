const mongoose = require("mongoose")

const refreshTokenModel = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "user"
        },
        refreshToken: {
            type: String,
            required: true
        },
        expireAt: {
            type: Date,
            default: Date.now,
            index: { expires: 60 * 60 * 24 }
        }
    }
)

const RefreshToken = mongoose.model("refresh-tokens", refreshTokenModel)

module.exports = RefreshToken;