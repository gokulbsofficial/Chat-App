const asyncHandler = require("../middleware/asyncHandler");
const Inbox = require("../models/inboxModel");
const Chat = require("../models/chatModel");
const { ObjectId } = require("bson");

//  @route      GET /api/user
//  @desc       To sent user data
//  @access     private
exports.findUser = asyncHandler(async (req, res, next) => {
  let user = req.user;

  res.status(200).json({ user });
});

//  @route      GET /api/user/inboxes
//  @desc       To get inboxes
//  @access     private
exports.getInboxes = asyncHandler(async (req, res, next) => {
  try {
    let user = req.user;
    const inboxes = await Inbox.find({ userId: user._id });
    console.log(inboxes);
    res.status(200).json({ inboxes });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});

//  @route      GET /api/user/chats
//  @desc       To get persons chats
//  @access     private
exports.getChats = asyncHandler(async (req, res, next) => {
  try {
    let { inboxHash } = req.body;
    const chats = await Chat.find({ indox_hash: inboxHash });
    res.status(200).json({ chats });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});

//  @route      GET /api/user/create-inbox
//  @desc       To get inboxes
//  @access     private
exports.createInbox = asyncHandler(async (req, res, next) => {
  try {
    let { senderId } = req.body;
    let user = req.user;
    let userInbox = {
      userId: user._id,
      senderId: senderId,
      inboxHash: `1234567890`,
    };

    const inbox = await Inbox.create(userInbox);
    res.status(202).json({ inbox });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});


//  @route      GET /api/user/sent-msg
//  @desc       To sent message
//  @access     private
exports.createInbox = asyncHandler(async (req, res, next) => {
  try {
    const chat = await Inbox.create();
    res.status(202).json({ chat });
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
});