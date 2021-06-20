const express = require("express");
const router = express.Router();
const {
  findUser,
  getInboxes,
  getChats,
  createInbox,
} = require("../controller/userController");

router.route("/").get(findUser);

router.route("/inboxes").get(getInboxes);

router.route("/chats").post(getChats);

router.route("/create-inbox").post(createInbox);

module.exports = router;
