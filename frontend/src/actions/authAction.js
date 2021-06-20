import {
  USER_OTP_REQUEST,
  USER_OTP_SUCCESS,
  USER_OTP_FAIL,
  USER_OTP_VERIFY_REQUEST,
  USER_OTP_VERIFY_SUCCESS,
  USER_OTP_VERIFY_FAIL,
  USER_PROFILE_REQUEST,
  USER_PROFILE_SUCCESS,
  USER_MOBILE_PAGE,
  USER_LOGIN_SUCCESS,
  GET_TOKEN_SUCCESS,
  USER_PROFILE_FAIL,
  CLOUD_PASSWORD_REQUEST,
  CLOUD_PASSWORD_FAIL,
  FORGET_PASSWORD_REQUEST,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_FAIL,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAIL,
  ACCESS_TOKEN_REQUEST,
  ACCESS_TOKEN_SUCCESS,
  ACCESS_TOKEN_ERROR,
  ACCESS_TOKEN_NOTFOUND,
  AUTH_SOCKET_CONNECT,
  AUTH_SOCKET_DISCONNECT,
} from "../constants/authConstants";
import {
  connectAuthSocket,
  sentOtpSocket,
  verifyOtpSocket,
  loginProfileSocket,
  cloudPasswordSocket,
  forgetPasswordSocket,
  resetPasswordSocket,
  refreshTokenScoket,
  disconnectAuthScoket,
} from "../socketIo/authSocket";
import {
  disconnectUserScoket
} from "../socketIo/userSocket";
import { userLogoutAction } from "./userActions";
import { retrunErrors } from "./errorAction";
import Cookies from "universal-cookie";
import {
  USER_SOCKET_DISCONNECT,
} from "../constants/userConstants";
const cookies = new Cookies();

export const makeConnectAuthSocket = () => async (dispatch, getState) => {
  try {
    const { token, authSocket } = getState().authInfo;
    const { userSocket } = getState().userInfo;
    if (!token) {
      console.log(token);
      if (!authSocket) {
        await connectAuthSocket(token);
        dispatch({ type: AUTH_SOCKET_CONNECT });
        if (userSocket) {
          await disconnectUserScoket();
          dispatch({ type: USER_SOCKET_DISCONNECT });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const sentOtp = (mobile, channel) => async (dispatch) => {
  try {
    dispatch({ type: USER_OTP_REQUEST });

    await sentOtpSocket(mobile, channel);

    dispatch({ type: USER_OTP_SUCCESS, pageStep: 2 });
  } catch (error) {
    console.log(
      dispatch(retrunErrors(error.msg, error.statusCode, "USER_OTP_FAIL"))
    );
    dispatch({
      type: USER_OTP_FAIL,
      pageStep: 1,
    });
  }
};

export const verifyOtp = (mobile, code) => async (dispatch) => {
  try {
    dispatch({ type: USER_OTP_VERIFY_REQUEST });

    const { data } = await verifyOtpSocket(mobile, code);

    if (data.accountType === "New Account") {
      dispatch({ type: USER_OTP_VERIFY_SUCCESS, pageStep: 3 });
    } else if (data.accountType === "Old Account") {
      if (data.TwoStepVerification === true) {
        dispatch({ type: USER_OTP_VERIFY_SUCCESS, pageStep: 4 });
      } else {
        localStorage.setItem("userToken", JSON.stringify(data.token));
        dispatch({ type: USER_LOGIN_SUCCESS });
        dispatch({ type: GET_TOKEN_SUCCESS, payload: data.token, pageStep: 1 });
        await disconnectAuthScoket();
        dispatch({ type: AUTH_SOCKET_DISCONNECT });
      }
    }
  } catch (error) {
    dispatch(retrunErrors(error.msg, error.statusCode, "USER_OTP_VERIFY_FAIL"));

    dispatch({
      type: USER_OTP_VERIFY_FAIL,
      pageStep: 2,
    });
  }
};

export const loginProfile = (loginData) => async (dispatch) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST });

    let { data } = await loginProfileSocket(loginData);
    
    localStorage.setItem("userToken", JSON.stringify(data.token));
    dispatch({ type: USER_PROFILE_SUCCESS });
    dispatch({ type: USER_LOGIN_SUCCESS });
    dispatch({ type: GET_TOKEN_SUCCESS, payload: data.token, pageStep: 1 });
    await disconnectAuthScoket();
    dispatch({ type: AUTH_SOCKET_DISCONNECT });

  } catch (error) {
    dispatch(retrunErrors(error.msg, error.statusCode, "USER_PROFILE_FAIL"));

    dispatch({
      type: USER_PROFILE_FAIL,
      pageStep: 3,
    });
  }
};

export const cloudPassword = (mobile, password) => async (dispatch) => {
  try {
    dispatch({ type: CLOUD_PASSWORD_REQUEST });

    let { data } = await cloudPasswordSocket(mobile, password);

    localStorage.setItem("userToken", JSON.stringify(data.token));
    dispatch({ type: USER_LOGIN_SUCCESS });
    dispatch({ type: GET_TOKEN_SUCCESS, payload: data.token, pageStep: 1 });
    await disconnectAuthScoket();
    dispatch({ type: AUTH_SOCKET_DISCONNECT });
  } catch (error) {
    dispatch(retrunErrors(error.msg, error.statusCode, "CLOUD_PASSWORD_FAIL"));
    dispatch({
      type: CLOUD_PASSWORD_FAIL,
      pageStep: 4,
    });
  }
};

export const forgetPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGET_PASSWORD_REQUEST });

    await forgetPasswordSocket(email);

    dispatch({ type: FORGET_PASSWORD_SUCCESS });
  } catch (error) {
    dispatch(retrunErrors(error.msg, error.statusCode, "FORGET_PASSWORD_FAIL"));
    dispatch({
      type: FORGET_PASSWORD_FAIL,
      pageStep: 5,
    });
  }
};

export const resetPassword = (token, password) => async (dispatch) => {
  try {
    dispatch({ type: RESET_PASSWORD_REQUEST });

    await resetPasswordSocket(token, password);

    dispatch({ type: RESET_PASSWORD_SUCCESS });
  } catch (error) {
    dispatch(retrunErrors(error.msg, error.statusCode, "RESET_PASSWORD_FAIL"));

    dispatch({
      type: RESET_PASSWORD_FAIL,
    });
  }
};

export const mobilePage = () => (dispatch) => {
  dispatch({ type: USER_MOBILE_PAGE, pageStep: 1 });
};

export const checkRefreshToken = () => (dispatch) => {
  const accessToken = cookies.get("authSession");
  const refreshToken = cookies.get("refreshTokenID");

  if (!accessToken && !refreshToken) {
    dispatch({ type: ACCESS_TOKEN_NOTFOUND });
  }

  if (accessToken && refreshToken) {
    dispatch({ type: ACCESS_TOKEN_SUCCESS });
  }

  if (!accessToken && refreshToken) {
    dispatch({ type: ACCESS_TOKEN_REQUEST });

    refreshTokenScoket()
      .then((data) => {
        dispatch({ type: ACCESS_TOKEN_SUCCESS });
        localStorage.setItem("userToken", JSON.stringify(data.token));
        dispatch({ type: GET_TOKEN_SUCCESS, payload: data.token });
      })
      .catch((error) => {
        dispatch(
          retrunErrors(error.msg, error.statusCode, "ACCESS_TOKEN_ERROR")
        );
        dispatch({
          type: ACCESS_TOKEN_ERROR,
        });
        userLogoutAction();
      });
  }
};
