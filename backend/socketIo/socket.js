const userSocket = require("./userSocket");
const adminSocket = require("./authSocket");

const Socket = (http) => {
  const io = require("socket.io")(http, {
    cors: {
      origin: [
        process.env.CLIENT_URL,
        "http://localhost:3001",
        "https://3c9827eb80e5.ngrok.io",
        "https://hoppscotch.io",
      ],
      credentials: true,
    },
  });

  // Sub sockets
  userSocket(io);
  adminSocket(io);
};

module.exports = Socket;
