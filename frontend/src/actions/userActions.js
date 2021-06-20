import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  CLEAR_USER_INFO,
  USER_SOCKET_DISCONNECT,
  USER_SOCKET_CONNECT,
} from "../constants/userConstants";
import {
  AUTH_SOCKET_CONNECT,
  AUTH_SOCKET_DISCONNECT,
  CLEAR_AUTH_INFO,
} from "../constants/authConstants";
import {
  connectUserSocket,
  getUserData,
  logoutSocket,
  disconnectUserScoket,
} from "../socketIo/userSocket";
import {
  connectAuthSocket,
  disconnectAuthScoket,
} from "../socketIo/authSocket";
import { clearErrors } from "./errorAction";

// Get token & load User
export const getUserAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_USER_REQUEST });

    const token = getState().authInfo.token;

    if (!token) {
      dispatch(userLogoutAction());
    }

    let { data } = await getUserData(token);

    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_USER_ERROR,
      payload: error,
    });
    if (error?.msg === "Not authorized please login again") {
      dispatch(userLogoutAction());
    }
  }
};

export const makeConnectUserSocket = () => async (dispatch, getState) => {
  try {
    const { token, authSocket } = getState().authInfo;
    const { userSocket } = getState().userInfo;
console.log(2);
    if (token) {
      if (!userSocket) {
        await connectUserSocket(token);
        dispatch({ type: USER_SOCKET_CONNECT });
        if (authSocket) {
          await disconnectAuthScoket();
          dispatch({ type: AUTH_SOCKET_DISCONNECT });
        }
      }
    } else {
      dispatch(userLogoutAction());
      await dispatch(connectAuthSocket());
      dispatch({ type: AUTH_SOCKET_CONNECT });
    }
  } catch (error) {
    // dispatch(userLogoutAction());
    console.log(error);
  }
};

export const userLogoutAction = () => async (dispatch) => {
  await logoutSocket();

  localStorage.removeItem("userToken");
  clearErrors();
  dispatch({ type: CLEAR_USER_INFO });
  dispatch({ type: CLEAR_AUTH_INFO });
  await disconnectUserScoket();
  dispatch({ type: USER_SOCKET_DISCONNECT });
};
