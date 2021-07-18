const authHelper = require("../helpers/authHelper");
var cookie = require("cookie");
const logger = require("../config/logger");
const {
  CONNECTION_EVENT,
  DISCONNECT_EVENT,
  SENT_OTP_EVENT,
  VERIFY_OTP_EVENT,
  LOGIN_PROFILE_EVENT,
  CLOUD_PASSWORD_EVENT,
  FORGET_PASSWORD_EVENT,
  RESET_PASSWORD_EVENT,
  REFRESH_TOKEN_EVENT,
  DISCONNECT_AUTH_EVENT,
} = require("../config/default").authSocketEvent;
const NAMESPACE = "UserSocket";

const adminSocket = (io) => {
  const auth = io.of("/auth");
  
  auth.on(CONNECTION_EVENT, (socket) => {
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    logger.info(NAMESPACE, `Cookies => `, cookies);
    logger.info(
      NAMESPACE,
      `New Connection Established in AUTH => ${socket.id}`
    );

    socket.on(SENT_OTP_EVENT, (data) => {
      authHelper
        .sentOtp(data)
        .then((response) => {
          socket.emit(SENT_OTP_EVENT, response);
        })
        .catch((error) => {
          socket.emit(SENT_OTP_EVENT, error);
        });
    });

    socket.on(VERIFY_OTP_EVENT, (data) => {
      authHelper
        .verifyOTP(data)
        .then((response) => {
          socket.emit(VERIFY_OTP_EVENT, response);
        })
        .catch((error) => {
          socket.emit(VERIFY_OTP_EVENT, error);
        });
    });

    socket.on(LOGIN_PROFILE_EVENT, (data) => {
      authHelper
        .loginProfile(data)
        .then((response) => {
          socket.emit(LOGIN_PROFILE_EVENT, response);
        })
        .catch((error) => {
          socket.emit(LOGIN_PROFILE_EVENT, error);
        });
    });

    socket.on(CLOUD_PASSWORD_EVENT, (data) => {
      authHelper
        .cloudPassword(data)
        .then((response) => {
          socket.emit(CLOUD_PASSWORD_EVENT, response);
        })
        .catch((error) => {
          socket.emit(CLOUD_PASSWORD_EVENT, error);
        });
    });

    socket.on(FORGET_PASSWORD_EVENT, (data) => {
      authHelper
        .forgetPasswod(data)
        .then((response) => {
          socket.emit(FORGET_PASSWORD_EVENT, response);
        })
        .catch((error) => {
          socket.emit(FORGET_PASSWORD_EVENT, error);
        });
    });

    socket.on(RESET_PASSWORD_EVENT, (data) => {
      authHelper
        .resetPassword(data)
        .then((response) => {
          socket.emit(RESET_PASSWORD_EVENT, response);
        })
        .catch((error) => {
          socket.emit(RESET_PASSWORD_EVENT, error);
        });
    });

    socket.on(REFRESH_TOKEN_EVENT, (data) => {
      console.log(data);
      // let refreshToken = socket.request.headers.cookie.refreshToken
      authHelper
        .upgradeAccessToken(data)
        .then((response) => {
          socket.emit(REFRESH_TOKEN_EVENT, response);
        })
        .catch((error) => {
          socket.emit(REFRESH_TOKEN_EVENT, error);
        });
    });

    socket.on(DISCONNECT_AUTH_EVENT, () => {
      socket.disconnect();
    });

    socket.on(CONNECTION_EVENT, () => {
      logger.info(NAMESPACE, `One socket disconnected in AUTH => ${socket.id}`);
    });
  });
};

module.exports = adminSocket;
