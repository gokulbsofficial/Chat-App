const User = require("../models/userModel");
const Inbox = require("../models/inboxModel");
const Conversation = require("../models/conversationModel");
const { ObjectId } = require("mongoose").Types;

exports.setUserStatus = (user, status) => {
  if (status === "isOnline") {
    status = `online`;
  }

  if (status === "isOffline") {
    date = new Date().toLocaleString();
    status = `lastseen at ${date}`;
  }

  if (status === "isTyping") {
    status = `typing...`;
  }

  User.findOneAndUpdate(
    { _id: user._id },
    { userStatus: status },
    (err, doc) => {
      if (err) {
        console.log(error.message);
        // return next(new Error("Set Status Error"));
      }
    }
  );
};

exports.getUser = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!user) {
        return reject({
          success: false,
          msg: `Unauthorized event`,
        });
      }

      return resolve({
        success: true,
        data: {
          user,
        },
      });
    } catch (error) {
      return reject({
        success: false,
        msg: error.message,
      });
    }
  });
};

exports.searchUsers = async ({ quary, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!quary) {
        return reject({
          success: false,
          msg: `Provide quary event`,
        });
      }

      let users = await User.aggregate([
        {
          $match: {
            $and: [
              { _id: { $ne: ObjectId(userId) } },
              {
                $or: [
                  { name: { $regex: `^${quary}`, $options: "i" } },
                  { userName: { $regex: `^${quary}`, $options: "i" } },
                  { mobile: { $regex: `^${quary}$`, $options: "i" } },
                ],
              },
            ],
          },
        },
        {
          $project: {
            accounts: 0,
            TwoStepVerification: 0,
            logs: 0,
            __v: 0,
          },
        },
      ]);

      return resolve({
        success: true,
        data: { users },
      });
    } catch (error) {
      return reject({
        success: false,
        msg: error.message,
      });
    }
  });
};

exports.getUserInboxes = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!user) {
        return reject({
          success: false,
          msg: `Unauthorized event`,
        });
      }

      let inboxes = await Inbox.aggregate([
        {
          $match: { userId: ObjectId(user._id) },
        },
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "sender",
          },
        },
        { $unwind: "$sender" },
        {
          $lookup: {
            from: "conversations",
            localField: "conversationId",
            foreignField: "_id",
            as: "conversations",
          },
        },
        {
          $unwind: "$conversations",
        },
        {
          $addFields: {
            lastMsg: { $last: "$conversations.messages" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "lastMsg.authorId",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
        {
          $addFields: {
            authorName: "$author.name",
          },
        },
        {
          $project: {
            userId: 0,
            senderId: 0,
            "sender.accounts": 0,
            "sender.TwoStepVerification": 0,
            "sender.logs": 0,
            "sender.__v": 0,
            __v: 0,
            conversations: 0,
            author: 0,
          },
        },
      ]);
      return resolve({
        success: true,
        data: { inboxes },
      });
    } catch (error) {
      console.log(2);
      return reject({
        success: false,
        msg: error.message,
      });
    }
  });
};

exports.createConversation = async ({
  userId,
  senderId,
  msgData,
  type,
  groupId,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !msgData || !type) {
        return reject({
          success: false,
          msg: `Provide valid datas in event`,
        });
      }
      if (type === "private-chat") {
        let conversation = await Conversation.findOne({
          $or: [
            { participants: [userId, senderId] },
            { participants: [senderId, userId] },
          ]
        });

        if (conversation) {
          conversation.messages = [
            ...conversation.messages,
            { ...msgData },
          ];

          let { _id, messages } = await conversation.save();

          return resolve({
            response: {
              success: true,
              data: {
                convId: _id,
                messages,
              },
            },
            type: "Old Conv",
          });
        } else {
          const { _id, messages } = await Conversation.create({
            participants: [userId, senderId],
            messages: [{ ...msgData}],
          });

          let userInbox = await Inbox.create({
            type,
            userId: userId,
            senderId: senderId,
            conversationId: _id,
          });
          let senderInbox = await Inbox.create({
            type,
            userId: senderId,
            senderId: userId,
            conversationId: _id,
          });

          return resolve({
            response: {
              success: true,
              data: { convId: _id, messages },
            },
            type: "New Conv",
            userInbox,
            senderInbox,
          });
        }
      }

      if (type === "group-chat") {
        let conversation = await Conversation.findOne({
          $and: [{ groupId }, { participants: { $in: [userId] } }],
        });

        if (!conversation) {
          const { _id, messages } = await Conversation.create({
            groupId,
            participants: [{ userId }],
            roles: {
              admin: [{ userId }],
            },
            messages: [],
          });
          let userInbox = await Inbox.create({
            type,
            userId: userId,
            groupId: groupId,
            conversationId: _id,
          });
          return resolve({
            response: {
              success: true,
              data: { convId: _id, messages },
            },
            userInbox,
            type: "new Conv",
          });
        } else {
          return reject({
            success: false,
            msg: "Group Conversation already exist",
          });
        }
      }
    } catch (error) {
      console.log(error.message);
      return reject({
        success: false,
        msg: error.message,
      });
    }
  });
};

exports.getUserConversation = async ({ userId, senderId, convId, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId || !convId || !type) {
        return reject({
          success: false,
          msg: `Provide datas event`,
        });
      }
      if (type === "private-chat") {
        let conversation = await Conversation.aggregate([
          {
            $match: {
              $and: [
                { _id: ObjectId(convId) },
                {
                  $or: [
                    {
                      participants: [ObjectId(userId), ObjectId(senderId)],
                    },
                    {
                      participants: [ObjectId(senderId), ObjectId(userId)],
                    },
                  ],
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "participants",
              foreignField: "_id",
              as: "members",
            },
          },
          {
            $project: {
              _id: 0,
              members: 1,
              messages: 1,
            },
          },
        ]);

        let { messages, members } = conversation[0];

        return resolve({
          success: true,
          data: { messages, members },
        });
      }

      if (type === "group-chat") {
        let conversation = await Conversation.aggregate([
          {
            $match: {
              $and: [
                { _id: ObjectId(convId) },
                {
                  participants: { $in: [ObjectId(userId)] },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "participants",
              foreignField: "_id",
              as: "members",
            },
          },
          {
            $project: {
              _id: 0,
              members: 1,
              messages: 1,
              roles: 1,
            },
          },
        ]);

        let { messages, members } = conversation[0];

        return resolve({
          success: true,
          data: { messages, members, roles },
        });
      }
    } catch (error) {
      return reject({
        success: false,
        msg: error.message,
      });
    }
  });
};

exports.sentMessage = async ({ userId, convId, msgData, type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!convId || !msgData || !userId) {
        return reject({
          success: false,
          msg: `Provide valid datas in event`,
        });
      }

      if (type === "private-chat") {
        const newConv = await Conversation.findOneAndUpdate(
          {
            $and: [
              { _id: convId },
              {
                participants: { $in: [userId] },
              },
            ],
          },
          {
            $push: {
              messages: [{ ...msgData }],
            },
          },
          { new: true }
        );
        let message = newConv.messages[newConv.messages.length - 1];

        resolve({
          success: true,
          data: { message },
        });
      }
    } catch (error) {
      return reject({
        success: false,
        msg: `message creation faild in event`,
      });
    }
  });
};

//  @socket name    logout
//  @desc           To clear all cookies and remove refreshToken in db
exports.logout = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // if (req.cookies.refreshToken) {
      //   let refreshToken = req.cookies.refreshToken;
      //   await RefreshToken.deleteMany({ refreshToken });
      // }
      // .clearCookie("accessToken")
      // .clearCookie("authSession")
      // .clearCookie("refreshToken")
      // .clearCookie("refreshTokenID")

      return resolve({
        success: true,
        data: {
          message: `Logout Successsfully`,
        },
      });
    } catch (error) {
      reject({ success: false, statusCode: 400, msg: error.message });
    }
  });
};
