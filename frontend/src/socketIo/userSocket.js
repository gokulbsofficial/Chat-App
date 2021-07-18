import {
  GET_USER_EVENT,
  GET_INBOXES_EVENT,
  NEW_INBOX_ARRIVED_EVENT,
  SEARCH_USER_EVENT,
  CREATE_CONVERSATION_EVENT,
  GET_CONVERSATION_EVENT,
  SENT_MESSAGE_EVENT,
  RECIEVED_MESSAGE_EVENT,
  CONNECT_ERROR_EVENT,
  LOGOUT_EVENT,
  RECONNECT_ATTEMPT_EVENT,
  CONNECT_EVENT,
  ERROR_EVENT,
  RECONNECTING_EVENT,
  RECONNECT_EVENT,
  RECONNECT_FAILED_EVENT,
  RECONNECT_ERROR_EVENT,
  PING_EVENT,
  CONNECT_TIMEOUT_EVENT,
  DISCONNECT_EVENT,
} from "../constants/userSocketConstants";
import { userSocketEmitted } from "../screens/userScreens/HomeScreen";
import { getSocket } from "./socket";

let socket;
let reconnectionAttempts = 6;
let reconnectionDelayMax = 15000;

export const connectUserSocket = async (token) => {
  if (token) {
    socket = await getSocket("user", {
      auth: {
        token,
      },
      withCredentials: true,
      transports: ["polling", "websocket"],
      reconnectionDelayMax, // how long to initially wait before attempting a new reconnection. Affected by +/- randomizationFactor, for example the default initial delay will be between 500 to 1500ms
      reconnectionAttempts, // number of reconnection attempts before giving up
    });
  }
};

export const getUserData = () => {
  return new Promise((resolve, reject) => {
    socket.emit(GET_USER_EVENT);
    socket.on(GET_USER_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const getUserInboxes = () => {
  return new Promise((resolve, reject) => {
    socket.emit(GET_INBOXES_EVENT);
    socket.on(GET_INBOXES_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const getSearchData = (quary, userId) => {
  return new Promise((resolve, reject) => {
    socket.emit(SEARCH_USER_EVENT, { quary, userId });
    socket.on(SEARCH_USER_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const getUserConversation = (getData) => {
  return new Promise((resolve, reject) => {
    socket.emit(GET_CONVERSATION_EVENT, getData);
    socket.on(GET_CONVERSATION_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const createConversation = (createData) => {
  return new Promise((resolve, reject) => {
    socket.emit(CREATE_CONVERSATION_EVENT, createData);
    socket.on(CREATE_CONVERSATION_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const sendMsgSocket = (sentData) => {
  return new Promise((resolve, reject) => {
    socket.emit(SENT_MESSAGE_EVENT, sentData);
    socket.on(SENT_MESSAGE_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const logoutSocket = () => {
  return new Promise((resolve, reject) => {
    socket.emit(LOGOUT_EVENT, "logout");
    socket.on(LOGOUT_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const disconnectUserScoket = () => {
  socket.disconnect();
};

export const userListenerEvents = () => {
  // Fired when a new arrived inbox occurs
  socket?.on(NEW_INBOX_ARRIVED_EVENT, ({ data }) => {
    userSocketEmitted({ data, Event: NEW_INBOX_ARRIVED_EVENT });
  });

  // Fired when a new msg occurs
  socket?.on(RECIEVED_MESSAGE_EVENT, ({ data }) => {
    console.log(data,"userSoicket");
    userSocketEmitted({ data, Event: RECIEVED_MESSAGE_EVENT });
  });

  // Fired upon connection to the Namespace (including a successful reconnection)
  socket?.on(CONNECT_EVENT, () => {
    let data = {
      socketId: socket.id,
      connected: socket.connected,
      disconnected: socket.disconnected,
    };
    if (data.connected) {
      userSocketEmitted({ data, Event: CONNECT_EVENT });
    }
  });

  // Fired when an namespace middleware error occurs
  socket?.on(CONNECT_ERROR_EVENT, (err) => {
    if (
      err.message ===
        `${
          "Unauthorized event" ||
          "Token Not Found" ||
          "Yours account is Blocked for Spam Reports"
        }` ||
      err.code === "invalid_token"
    ) {
      userSocketEmitted({ msg: err.message, Event: LOGOUT_EVENT });
    }
    console.log("CONNECT_ERROR_EVENT", err.message); // the error message, for example "Session ID unknown"
    // socket.io.opts.transports = ["polling", "websocket"];
    socket.disconnect().connect();
  });

  // Fired upon a connection timeout
  socket?.on(CONNECT_TIMEOUT_EVENT, () => {
    console.log("CONNECT_TIMEOUT_EVENT");
  });

  // Fired upon disconnection
  socket?.on(DISCONNECT_EVENT, (reason) => {
    let data = {
      socketId: socket.id,
      connected: socket.connected,
      disconnected: socket.disconnected,
    };
    switch (reason) {
      // Connection was disconnected by server io
      case "io server disconnect":
        data.reason = {
          _id: reason,
          msg: "Connection was disconnected by server io",
        };
        socket.connect();
        break;
      // Connection was disconnected by  client io
      case "io client disconnect":
        data.reason = {
          _id: reason,
          msg: "Connection was disconnected by client io",
        };
        break;
      // The connection was closed
      case "transport error":
        data.reason = {
          _id: reason,
          msg: "The user has lost connection, or the network was changed from WiFi to 4G",
        };
        socket.connect();
        break;
      // The connection has encountered an error
      case "transport close":
        data.reason = {
          _id: reason,
          msg: "The server was killed during a HTTP long-polling cycle",
        };
        socket.connect();
        break;
      case "ping timeout":
        data.reason = {
          _id: reason,
          msg: `The server did not send a PING within the pingInterval + pingTimeout range`,
        };
        socket.connect();
        break;
      default:
        break;
    }

    if (data.disconnected) {
      userSocketEmitted({ data, Event: DISCONNECT_EVENT });
    }
  });

  // Fired upon a connection error.
  socket?.io?.on(ERROR_EVENT, (error) => {
    console.log(error);
  });

  // Fired upon a successful reconnection
  socket?.io?.on(RECONNECT_EVENT, (attempt) => {
    console.log(`reconnect ${attempt}`);
  });

  // Fired upon an attempt to reconnect
  socket?.on(RECONNECTING_EVENT, (delay, attempt) => {
    console.log("reconnecting", { delay, attempt });
    // if (attempt === reconnectionAttempts) {
    //   setTimeout(() => {
    //     socket.socket.reconnect();
    //   }, 15000);
    //   return console.log("Server reconnect in 15s");
    // }
  });

  // Fired upon an attempt to reconnect
  socket?.io?.on(RECONNECT_ATTEMPT_EVENT, (attempt) => {
    console.log(`reconnect_attempt => ${attempt}`);
    if (attempt === reconnectionAttempts) {
      setTimeout(() => {
        socket.disconnect().connect();
      }, 15 * 1000);
      return console.log("Server reconnect in 15s");
    }
  });

  // Fired upon a reconnection attempt error
  socket?.io?.on(RECONNECT_ERROR_EVENT, (error) => {
    console.log(error);
  });

  // Fired when couldn’t reconnect within reconnectionAttempts
  socket?.io?.on(RECONNECT_FAILED_EVENT, () => {
    console.log("RECONNECT_FAILED_EVENT");
  });

  // Fired when a ping packet is received from the server
  socket?.io?.on(PING_EVENT, () => {
    console.log("PING_EVENT");
  });
};

export default socket;
