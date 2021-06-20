import { getSocket } from "./socket";

let socket;

export const connectUserSocket = (token) => {
  console.log(token);
  if(token){
    socket = getSocket("user", {
      extraHeaders: { Authorization: `Bearer ${token}` },
    });
  }
};

// sentOtpSocket
export const getUserData = () => {
  return new Promise((resolve, reject) => {
    socket.emit("get-user");
    socket.on("get-user", (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const logoutSocket = () => {
  return new Promise((resolve, reject) => {
    socket.emit("logout", "logout");
    socket.on("logout", (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const disconnectUserScoket = () => {
  socket.emit("disconnect-user");
};

// socket.on('unauthorized', (error, callback) => {
//   if (error.data.type == 'UnauthorizedError' || error.data.code == 'invalid_token') {
//     // redirect user to login page perhaps or execute callback:
//     callback();
//     console.log('User token has expired');
//   }
// });
