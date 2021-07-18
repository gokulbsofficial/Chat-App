const mongoose = require("mongoose");

const messageScheme = mongoose.Schema({
  authorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  type: {
    type: String,
    required: true,
    default: "text-msg",
  },

  message: {
    type: String,
  },

  filePath: {
    type: String,
  },

  fileName: {
    type: String,
  },

  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },

  deletedUserId: [
    {
      type: mongoose.Types.ObjectId,
    },
  ],

  timestamp: {
    type: String,
    required: true,
  },
});

const conversationSchema = mongoose.Schema(
  {
    groupId: {
      type: mongoose.Types.ObjectId,
    },
    participants: [
      {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    ],
    roles: {
      type:Object
    },
    messages: [messageScheme],
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Conversations", conversationSchema);
