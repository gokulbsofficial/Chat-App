const userSocket = require("./userSocket");
const adminSocket = require("./authSocket");
const { server, client } = require("../config/default");

const Socket = (http) => {
  const io = require("socket.io")(http, {
    cors: {
      origin: [client.url, "https://hoppscotch.io/"],
      methods: ["GET", "POST"],
      allowedHeaders: ["Authorization"],
      credentials: true,
    },
    cookie: {
      name: "accessToken",
      httpOnly: true,
      secure: server.node_env === "production" ? true : false,
      sameSite: "strict",
      maxAge: 86400,
    },
    cookie: {
      name: "refreshToken",
      httpOnly: true,
      secure: server.node_env === "production" ? true : false,
      sameSite: "strict",
      maxAge: 86400,
    },
  });

  // Sub sockets
  userSocket(io);
  adminSocket(io);
};

module.exports = Socket;
