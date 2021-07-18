import {
  USER_SOCKET_CONNECT,
  USER_SOCKET_CONNECTED,
  USER_SOCKET_DISCONNECT,
  USER_SOCKET_DISCONNECTED,
  CLEAR_USER_SOCKET_INFO
} from "../constants/userSocketConstants";
import {
  AUTH_SOCKET_CONNECT,
  AUTH_SOCKET_CONNECTED,
  AUTH_SOCKET_DISCONNECT,
  AUTH_SOCKET_DISCONNECTED,
  CLEAR_AUTH_SOCKET_INFO
} from "../constants/authSocketConstants";

export const userSocketReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SOCKET_CONNECT:
      return {
        ...state,
        connectRequest: true,
      };
    case USER_SOCKET_CONNECTED:
      return {
        ...state,
        connectRequest: false,
        connected: action.payload.connected,
        disconnected: action.payload.disconnected,
        socketId: action.payload.socketId,
      };
    case USER_SOCKET_DISCONNECT:
      return {
        ...state,
        disconnectRequest: true,
      };
    case USER_SOCKET_DISCONNECTED:
      return {
        ...state,
        disconnectRequest: false,
        connected: action.payload.connected,
        disconnected: action.payload.disconnected,
        socketId: action.payload.socketId,
        reason: action.payload.reason,
      };
    case CLEAR_USER_SOCKET_INFO:
      return (state = {});
    default:
      return state;
  }
};

export const authSocketReducer = (state = {}, action) => {
  switch (action.type) {
    case AUTH_SOCKET_CONNECT:
      return {
        ...state,
        connectRequest: true,
      };
    case AUTH_SOCKET_CONNECTED:
      return {
        ...state,
        connectRequest: false,
        connected: action.payload.connected,
        disconnected: action.payload.disconnected,
        socketId: action.payload.socketId,
      };
    case AUTH_SOCKET_DISCONNECT:
      return {
        ...state,
        disconnectRequest: true,
      };
    case AUTH_SOCKET_DISCONNECTED:
      return {
        ...state,
        disconnectRequest: false,
        connected: action.payload.connected,
        disconnected: action.payload.disconnected,
        socketId: action.payload.socketId,
        reason: action.payload.reason,
      };
    case CLEAR_AUTH_SOCKET_INFO:
      return (state = {});
    default:
      return state;
  }
};
