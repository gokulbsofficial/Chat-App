var cookie = require("cookie");
const userHelper = require("../helpers/userHelper");
const { authorization } = require("../middleware/authMiddleware");
const logger = require("../config/logger");
const {
  CONNECTION_EVENT,
  GET_USER_EVENT,
  GET_INBOXES_EVENT,
  CREATE_CONVERSATION_EVENT,
  GET_CONVERSATION_EVENT,
  SEARCH_USER_EVENT,
  NEW_INBOX_ARRIVED_EVENT,
  SENT_MESSAGE_EVENT,
  RECIEVED_MESSAGE_EVENT,
  LOGOUT_EVENT,
  DISCONNECT_USER_EVENT,
  DISCONNECT_EVENT,
  ERROR_EVENT
} = require("../config/default").userSocketEvent;
const NAMESPACE = "UserSocket";

const userSocket = (io) => {
  const User = io.of("/user");

  
  User.use(authorization);
  
  User.on(CONNECTION_EVENT, (socket) => {
    socket.join(`${socket.user._id}`); 
    userHelper.setUserStatus(socket.user, `isOnline`);
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    logger.info(NAMESPACE, `Cookies => `, cookies);
    logger.info(
      NAMESPACE,
      `New Connection Established in USER => ${socket.user.name} , ${socket.id}`
    );

    socket.on(GET_USER_EVENT, () => {
      let user = socket.user || null;
      userHelper
        .getUser(user)
        .then((response) => {
          socket.emit(GET_USER_EVENT, response);
        })
        .catch((error) => {
          socket.emit(GET_USER_EVENT, error);
        });
    });

    socket.on(GET_INBOXES_EVENT, () => {
      let user = socket.user || null;
      userHelper
        .getUserInboxes(user)
        .then((response) => {
          socket.emit(GET_INBOXES_EVENT, response);
          user.to(socket.id).emit("welcome", { Welxome: "Welcome" });
        })
        .catch((error) => {
          socket.emit(GET_INBOXES_EVENT, error);
        });
    });

    socket.on(SEARCH_USER_EVENT, (data) => {
      userHelper
        .searchUsers(data)
        .then((response) => {
          socket.emit(SEARCH_USER_EVENT, response);
        })
        .catch((error) => {
          socket.emit(SEARCH_USER_EVENT, error);
        });
    });

    socket.on(CREATE_CONVERSATION_EVENT, (data) => {
      let user = socket.user || null;
      userHelper
        .createConversation({ userId: user._id, ...data })
        .then(({ response, userInbox, senderInbox, type }) => {
          if (type === "New Conv") {
            sentNewInbox(userInbox, senderInbox);
          }
          socket.emit(CREATE_CONVERSATION_EVENT, { ...response });
        })
        .catch((error) => {
          socket.emit(CREATE_CONVERSATION_EVENT, error);
        });
    });

    const sentNewInbox = (userInbox, senderInbox) => {
      if (userInbox) {
        User.to(userInbox.userId).emit(NEW_INBOX_ARRIVED_EVENT, {
          newInbox: userInbox,
        });
      }
      if (senderInbox) {
        user
          .to(senderInbox.userId)
          .emit(NEW_INBOX_ARRIVED_EVENT, { newInbox: senderInbox });
      }
    };

    socket.on(GET_CONVERSATION_EVENT, (data) => {
      let user = socket.user || null;
      userHelper
        .getUserConversation({ userId: user._id, ...data })
        .then((response) => {
          socket.emit(GET_CONVERSATION_EVENT, response);
        })
        .catch((error) => {
          socket.emit(GET_CONVERSATION_EVENT, error);
        });
    });

    socket.on(SENT_MESSAGE_EVENT, async (data) => {
      let user = socket.user || null;
      userHelper
        .sentMessage({ userId: user._id, ...data })
        .then((response) => {
          socket.emit(SENT_MESSAGE_EVENT, response);
          if (data.type === "private-chat") {
            User.to(data.senderId).emit(RECIEVED_MESSAGE_EVENT, response);
          }
        })
        .catch((error) => {
          socket.emit(SENT_MESSAGE_EVENT, error);
        });
    });

    socket.on(LOGOUT_EVENT, (data) => {
      userHelper
        .logout(data)
        .then((response) => {
          socket.emit(LOGOUT_EVENT, response);
        })
        .catch((error) => {
          socket.emit(LOGOUT_EVENT, error);
        });
    });

    socket.on(DISCONNECT_USER_EVENT, () => {
      socket.disconnect();
    });

    socket.on(DISCONNECT_EVENT, () => {
      socket.leave(socket.user._id);
      userHelper.setUserStatus(socket.user, `isOffline`);
      logger.info(
        NAMESPACE,
        `One socket disconnected in USER => ${socket.user._id}, ${socket.id}`
      );
    });

    socket.on(ERROR_EVENT, (error) => {
      if (error.message === "Unauthorized event") {
        console.log("User token has expired");
      } else if (error.message === "Token Not Found") {
        console.log("Token not found");
        // socket.reconnect();
      }
      console.log(error);
    });
  });
};

module.exports = userSocket;
