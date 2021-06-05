const mongoose = require("mongoose");

const inboxSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  senderId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  inboxHash: {
    type: String,
    required: true,
  },
  lastMsg: { type: Array, default: [] },
  pinned: {
    type: Boolean,
    required: true,
    default: false,
  },
  muted: {
    type: Boolean,
    required: true,
    default: false,
  },
  seen: {
    type: Boolean,
    required: true,
    default: false,
  },
  unseen: {
    type: Number,
    required: true,
    default: 0,
  },
  deleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("inboxes", inboxSchema);
