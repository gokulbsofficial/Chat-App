const authHelper = require("../helpers/authHelper");
var cookieParser = require("socket.io-cookie");

const adminSocket = (io) => {
  const auth = io.of("/auth");

  auth.use(cookieParser);

  auth.on("connection", (socket) => {
    console.log(`New Connection Established in AUTH`.rainbow.bold);

    socket.on("sent-otp", (data) => {
      authHelper
        .sentOtp(data)
        .then((response) => {
          socket.emit("sent-otp", response);
        })
        .catch((error) => {
          socket.emit("sent-otp", error);
        });
    });

    socket.on("verify-otp", (data) => {
      authHelper
        .verifyOTP(data)
        .then((response) => {
          socket.emit("verify-otp", response);
        })
        .catch((error) => {
          socket.emit("verify-otp", error);
        });
    });

    socket.on("login-profile", (data) => {
      authHelper
        .loginProfile(data)
        .then((response) => {
          socket.emit("login-profile", response);
        })
        .catch((error) => {
          socket.emit("login-profile", error);
        });
    });

    socket.on("cloud-password", (data) => {
      authHelper
        .cloudPassword(data)
        .then((response) => {
          socket.emit("cloud-password", response);
        })
        .catch((error) => {
          socket.emit("cloud-password", error);
        });
    });

    socket.on("forget-password", (data) => {
      authHelper
        .forgetPasswod(data)
        .then((response) => {
          socket.emit("forget-password", response);
        })
        .catch((error) => {
          socket.emit("forget-password", error);
        });
    });

    socket.on("reset-password", (data) => {
      authHelper
        .resetPassword(data)
        .then((response) => {
          socket.emit("reset-password", response);
        })
        .catch((error) => {
          socket.emit("reset-password", error);
        });
    });

    socket.on("refresh-token", (data) => {
      console.log(data);
      // let refreshToken = socket.request.headers.cookie.refreshToken
      authHelper
        .upgradeAccessToken(data)
        .then((response) => {
          socket.emit("refresh-token", response);
        })
        .catch((error) => {
          socket.emit("refresh-token", error);
        });
    });

    socket.on("disconnect-auth",()=>{
      socket.disconnect()
    })

    socket.on("disconnect",()=>{
      console.log(`One AUTH socket disconnected`.rainbow.bold);
    })
  });
};

module.exports = adminSocket;
