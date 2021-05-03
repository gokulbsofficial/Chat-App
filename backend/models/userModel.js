const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    accountType: {
        type: String,
        default: "New Account",
    },
    name: {
        type: String,
    },
    userName: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        default: "Active",
    },
    TwoStepVerification: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
    },
    cloudPassword: {
        type: String,
        select: false,
    },
    resetCloudPasswd: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
    },
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
    groups: [
        {
            group: { type: mongoose.Schema.Types.ObjectId },
        },
    ],
    messages: [
        {
            user: { type: mongoose.Schema.Types.ObjectId },
            chats: [
                {
                    from: { type: mongoose.Schema.Types.ObjectId, required: true },
                    to: { type: mongoose.Schema.Types.ObjectId, required: true },
                    message: { type: String, required: true },
                    time: { type: String, required: true },
                    delete: { type: Boolean, default: false },
                },
            ],
        },
    ],
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("cloudPassword")) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.cloudPassword = await bcrypt.hash(this.cloudPassword, salt);
    next();
});

userSchema.methods.matchPasswords = async function (cloudPassword) {
    return await bcrypt.compare(cloudPassword, this.cloudPassword);
};

userSchema.methods.getSignedtoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "1y",
    });
};

userSchema.methods.getRefreshtoken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_REFRESH, {
        expiresIn: "1y",
    });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
