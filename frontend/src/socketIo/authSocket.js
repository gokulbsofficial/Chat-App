import { getSocket } from "./socket";
import {
  SENT_OTP_EVENT,
  VERIFY_OTP_EVENT,
  LOGIN_PROFILE_EVENT,
  CLOUD_PASSWORD_EVENT,
  FORGET_PASSWORD_EVENT,
  RESET_PASSWORD_EVENT,
  REFRESH_TOKEN_EVENT,
  RECONNECT_ATTEMPT_EVENT,
  CONNECT_EVENT,
  ERROR_EVENT,
  RECONNECTING_EVENT,
  RECONNECT_EVENT,
  DISCONNECT_EVENT,
  CONNECT_ERROR_EVENT
} from "../constants/authSocketConstants";
import { authSocketEmitted } from "../components/StepForm";

let socket;
let max_socket_reconnects = 6;

export const connectAuthSocket = (token) => {
  if (!token) {
    socket = getSocket("auth", {
      reconnectionDelayMax: 15000,
      reconnectionAttempts: max_socket_reconnects,
    });
  }
};

// sentOtpSocket
export const sentOtpSocket = (mobile, channel) => {
  return new Promise((resolve, reject) => {
    socket.emit(SENT_OTP_EVENT, {
      mobile,
      channel,
    });
    socket.on(SENT_OTP_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const verifyOtpSocket = (mobile, code) => {
  return new Promise((resolve, reject) => {
    socket.emit(VERIFY_OTP_EVENT, {
      mobile,
      code,
    });
    socket.on(VERIFY_OTP_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const loginProfileSocket = (data) => {
  return new Promise((resolve, reject) => {
    socket.emit(LOGIN_PROFILE_EVENT, {
      ...data,
    });
    socket.on(LOGIN_PROFILE_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const cloudPasswordSocket = (mobile, password) => {
  return new Promise((resolve, reject) => {
    socket.emit(CLOUD_PASSWORD_EVENT, {
      mobile,
      password,
    });
    socket.on(CLOUD_PASSWORD_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const forgetPasswordSocket = (email) => {
  return new Promise((resolve, reject) => {
    socket.emit(FORGET_PASSWORD_EVENT, {
      email,
    });
    socket.on(FORGET_PASSWORD_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const resetPasswordSocket = (token, password) => {
  return new Promise((resolve, reject) => {
    socket.emit(RESET_PASSWORD_EVENT, {
      token,
      password,
    });
    socket.on(RESET_PASSWORD_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const refreshTokenScoket = () => {
  return new Promise((resolve, reject) => {
    socket.emit(REFRESH_TOKEN_EVENT, {
      refreshToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYmM5NjRkOGQ0NWJiNWY5ZjRmZTNmZiIsImlhdCI6MTYyMzA3NjYwNywiZXhwIjoxNjU0NjM0MjA3fQ.A6geqlbvrm_bVzmojVuNaGcnc4GqBgBZlWkvpvxfM-k",
    });
    socket.on(REFRESH_TOKEN_EVENT, (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const disconnectAuthScoket = () => {
  socket.disconnect();
};

export const authListenerEvents = () => {
  socket?.on(RECONNECTING_EVENT, (delay, attempt) => {
    console.log({ delay, attempt });
    if (attempt === max_socket_reconnects) {
      setTimeout(() => {
        socket.socket.reconnect();
      }, 15000);
      return console.log("Server reconnect in 15s");
    }
  });

  socket?.on(CONNECT_ERROR_EVENT, (err) => {
    console.log("connect_error", err.message);
    console.log("req", err.req); // the request object
    console.log("code", err.code); // the error code, for example 1
    console.log("message", err.message); // the error message, for example "Session ID unknown"
    console.log("context", err.context); // some additional error context
    // socket.io.opts.transports = ["polling", "websocket"];
    // socket.disconnect().connect();
  });

  socket?.io?.on(RECONNECT_ATTEMPT_EVENT, (count) => {
    console.log(`reconnect_attempt in ${count}`);
  });

  socket?.io?.on(RECONNECT_EVENT, (count) => {
    console.log(`reconnect in ${count}`);
  });

  socket?.on(CONNECT_EVENT, () => {
    let data = {
      socketId: socket.id,
      connected: socket.connected,
      disconnected: socket.disconnected,
    };
    console.log(data);
    authSocketEmitted({ data, Event: CONNECT_EVENT });
    console.log("connect", socket);
  });

  socket?.on(DISCONNECT_EVENT, (reason) => {
    let data = {
      socketId: socket.id,
      reason: reason,
      connected: socket.connected,
      disconnected: socket.disconnected,
    };
    console.log(data);
    authSocketEmitted({ data, Event: DISCONNECT_EVENT });
    console.log("disconnect", reason, socket);
  });

  socket?.on(ERROR_EVENT, (error) => {
    console.log(Error, error);
  });
};
