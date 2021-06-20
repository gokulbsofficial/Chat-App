import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  CLEAR_USER_INFO,
  USER_SOCKET_CONNECT,
  USER_SOCKET_DISCONNECT,
} from "../constants/userConstants";

export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
      };
    case GET_USER_ERROR:
      return {
        ...state,
        loading: false,
        error: {
          success: action.payload.success,
          message: action.payload.message,
        },
      };
    case USER_SOCKET_CONNECT:
      return {
        ...state,
        userSocket: true,
      };
    case USER_SOCKET_DISCONNECT:
      return {
        ...state,
        userSocket: false,
      };
    case CLEAR_USER_INFO:
      return (state = {});
    default:
      return state;
  }
};
