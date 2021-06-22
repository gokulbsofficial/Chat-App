import { getSocket } from "./socket";

let socket;

export const connectAuthSocket = (token) => {
  if (!token) {
    socket = getSocket("auth");
  }
};

// sentOtpSocket
export const sentOtpSocket = (mobile, channel) => {
  return new Promise((resolve, reject) => {
    socket.emit("sent-otp", {
      mobile,
      channel,
    });
    socket.on("sent-otp", (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const verifyOtpSocket = (mobile, code) => {
  return new Promise((resolve, reject) => {
    socket.emit("verify-otp", {
      mobile,
      code,
    });
    socket.on("verify-otp", (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const loginProfileSocket = (data) => {
  return new Promise((resolve, reject) => {
    socket.emit("login-profile", {
      ...data,
    });
    socket.on("login-profile", (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const cloudPasswordSocket = (mobile, password) => {
  return new Promise((resolve, reject) => {
    socket.emit("cloud-password", {
      mobile,
      password,
    });
    socket.on("cloud-password", (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const forgetPasswordSocket = (email) => {
  return new Promise((resolve, reject) => {
    socket.emit("forget-password", {
      email,
    });
    socket.on("forget-password", (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const resetPasswordSocket = (token, password) => {
  return new Promise((resolve, reject) => {
    socket.emit("reset-password", {
      token,
      password,
    });
    socket.on("reset-password", (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const refreshTokenScoket = () => {
  return new Promise((resolve, reject) => {
    socket.emit("refresh-token", {
      refreshToken:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYmM5NjRkOGQ0NWJiNWY5ZjRmZTNmZiIsImlhdCI6MTYyMzA3NjYwNywiZXhwIjoxNjU0NjM0MjA3fQ.A6geqlbvrm_bVzmojVuNaGcnc4GqBgBZlWkvpvxfM-k",
    });
    socket.on("refresh-token", (data) => {
      if (data.success) {
        return resolve(data);
      }
      return reject(data);
    });
  });
};

export const disconnectAuthScoket = () => {
    socket.emit("disconnect-auth");
};

// socket.on("error",()=>{

// })