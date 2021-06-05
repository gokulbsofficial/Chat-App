const mongoose = require("mongoose");

const authorScheme = mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const messageScheme = mongoose.Schema({
  author: [authorScheme],

  msg: {
    type: String,
    required: true,
  },

  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },

  timestamp: {
    type: String,
    required: true,
  },
});

const fileScheme = mongoose.Schema({
  author: [authorScheme],

  filePath: {
    type: String,
    required: true,
  },

  fileName: {
    type: String,
    required: true
  },

  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },

  timestamp: {
    type: String,
    required: true,
  },
});

const deletedUsersScheme = mongoose.Schema(
    {
        userId:{
            type: mongoose.Types.ObjectId,
            required: false, 
        }
    }
);

const participantsScheme = mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

const chatSchema = mongoose.Schema({
  inboxHash: {
    type: String,
    required: true,
  },

  participants: [participantsScheme],

  message: [messageScheme],

  file: [fileScheme],

  deletedUserId: [deletedUsersScheme],

  // timestamp: true,
});

module.exports = mongoose.model("Chats", chatSchema);
