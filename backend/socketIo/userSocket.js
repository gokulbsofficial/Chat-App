var cookieParser = require("socket.io-cookie");
const userHelper = require("../helpers/userHelper");
const { authorization } = require("../middleware/authMiddleware");

const userSocket = (io) => {
  const user = io.of("/user");

  user.use(authorization);

  user.on("connection", (socket) => {
    userHelper.setUserStatus(socket.user, `isOnline`);
    console.log(
      `New Connection Established in USER => ${socket.id}`.rainbow.bold
    );

    socket.on("get-user", () => {
      let user = socket.user || null;
      console.log(user);
      userHelper
        .getUser(user)
        .then((response) => {
          socket.emit("get-user", response);
        })
        .catch((error) => {
          socket.emit("get-user", error);
        });
    });

    socket.on("logout", (data) => {
      userHelper
        .logout(data)
        .then((response) => {
          socket.emit("logout", response);
        })
        .catch((error) => {
          socket.emit("logout", error);
        });
    });

    socket.on("disconnect-user", () => {
      userHelper.setUserStatus(socket.user.id, `isOffline`);
      socket.disconnect();
    });

    socket.on("disconnect", () => {
      userHelper.setUserStatus(socket.user, `isOffline`);
    });

    socket.on("unauthorized", (error) => {
      if (
        error.data.type == "UnauthorizedError" ||
        error.data.code == "invalid_token"
      ) {
        console.log("User token has expired");
      }
      console.log(error);
    });
  });
};

module.exports = userSocket;
