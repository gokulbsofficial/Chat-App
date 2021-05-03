import {
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_ERROR,
    ACCESS_TOKEN_REQUEST,
    ACCESS_TOKEN_SUCCESS,
    ACCESS_TOKEN_ERROR,
    ACCESS_TOKEN_NOTFOUND,
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
    USER_LOGOUT,
    USER_PROFILE_FAIL,
    CLOUD_PASSWORD_REQUEST,
    CLOUD_PASSWORD_FAIL,
    FORGET_CLOUD_PASSWORD_REQUEST,
    FORGET_CLOUD_PASSWORD_SUCCESS,
    FORGET_CLOUD_PASSWORD_FAIL,
    RESET_CLOUD_PASSWORD_REQUEST,
    RESET_CLOUD_PASSWORD_SUCCESS,
    RESET_CLOUD_PASSWORD_FAIL,
} from "../constants/authConstants";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

// Get token & load User
export const getUserAction = () => async(dispatch, getState) => {
    try {
        dispatch({ type: GET_USER_REQUEST });

        const token = getState().authInfo.token;

        if(!token){
            dispatch(logout());
        }

        axios.defaults.headers.common["authorization"] = `Bearer ${token}`;

        await axios
            .get("/api/user")
            .then((res) => {
                dispatch({ type: GET_USER_SUCCESS, payload: res.data });
            })

    } catch (error) {
        dispatch({
            type: GET_USER_ERROR,
            payload:
                error.response && error.response.data
                    ? error.response.data
                    : error.message,
        });
        if (error?.response?.data?.message === "Not authorized please login again") {
            dispatch(logout());
        }
    }
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

        axios
            .post("/api/auth/refresh-token", {
                withCredentials: true,
            })
            .then((res) => {
                dispatch({ type: ACCESS_TOKEN_SUCCESS });
            })
            .catch((error) => {
                dispatch({
                    type: ACCESS_TOKEN_ERROR,
                    payload:
                        error.response && error.response.data
                            ? error.response.data
                            : error.message,
                });
                dispatch(logout());
            });
    }
};

export const sentOtp = (mobile, channel) => async (dispatch) => {
    try {
        dispatch({ type: USER_OTP_REQUEST });

        axios
            .post("/api/auth/sent-otp", { mobile, channel })
            .then((res) => {
                dispatch({ type: USER_OTP_SUCCESS, pageStep: 2 });
            })
            .catch((error) => {
                dispatch({
                    type: USER_OTP_FAIL,
                    payload:
                        error.response && error.response.data
                            ? error.response.data
                            : error.message,
                    pageStep: 1,
                });
            });
    } catch (error) {
        dispatch({
            type: USER_OTP_FAIL,
            pageStep: 1,
            payload:
                error.response && error.response.data
                    ? error.response.data
                    : error.message,
        });
    }
};

export const verifyOtp = (mobile, otp) => async (dispatch) => {
    try {
        dispatch({ type: USER_OTP_VERIFY_REQUEST });

        const { data } = await axios.post("/api/auth/verify-otp", { mobile, otp });

        if (data.accountType === "New Account") {
            dispatch({ type: USER_OTP_VERIFY_SUCCESS, pageStep: 3 });

        } else if (data.accountType === "Old Account") {

            if (data.TwoStepVerification === true) {
                dispatch({ type: USER_OTP_VERIFY_SUCCESS, pageStep: 4 });
            } else {
                localStorage.setItem("userToken", JSON.stringify(data.token));
                dispatch({ type: USER_LOGIN_SUCCESS });
                dispatch({ type: GET_TOKEN_SUCCESS, payload: data.token, pageStep: 1 });
            }
        }
    } catch (error) {
        dispatch({
            type: USER_OTP_VERIFY_FAIL,
            pageStep: 2,
            payload:
                error.response && error.response.data
                    ? error.response.data
                    : error.message,
        });
    }
};

export const loginProfile = ({ name, userName, mobile, profilePic }) => async (
    dispatch
) => {
    try {
        dispatch({ type: USER_PROFILE_REQUEST });

        let { data } = await axios.post("/api/auth/login-profile", {
            name,
            userName,
            mobile,
            profilePic,
        });

        dispatch({ type: USER_PROFILE_SUCCESS });
        dispatch({ type: USER_LOGIN_SUCCESS });
        dispatch({ type: GET_TOKEN_SUCCESS, payload: data.token, pageStep: 1 });
        localStorage.setItem("userToken", JSON.stringify(data.token));
    } catch (error) {
        dispatch({
            type: USER_PROFILE_FAIL,
            pageStep: 3,
            payload:
                error.response && error.response.data
                    ? error.response.data
                    : error.message,
        });
    }
};

export const cloudPassword = (mobile, password) => async (dispatch) => {
    try {
        dispatch({ type: CLOUD_PASSWORD_REQUEST });

        let { data } = await axios.post("/api/auth/cloud-password/", {
            mobile,
            password,
        });

        dispatch({ type: USER_LOGIN_SUCCESS });
        dispatch({ type: GET_TOKEN_SUCCESS, payload: data.token, pageStep: 1 });
        localStorage.setItem("userToken", JSON.stringify(data.token));
    } catch (error) {
        dispatch({
            type: CLOUD_PASSWORD_FAIL,
            pageStep: 4,
            payload:
                error.response && error.response.data
                    ? error.response.data
                    : error.message,
        });
    }
};

export const forgetCloudPasswd = (email) => async (dispatch) => {
    try {
        dispatch({ type: FORGET_CLOUD_PASSWORD_REQUEST });

        await axios.post("/api/auth/forget-cloud-passwd", { email });

        dispatch({ type: FORGET_CLOUD_PASSWORD_SUCCESS });
    } catch (error) {
        dispatch({
            type: FORGET_CLOUD_PASSWORD_FAIL,
            pageStep: 5,
            payload:
                error.response && error.response.data
                    ? error.response.data
                    : error.message,
        });
    }
};

export const resetCloudPasswd = (token, password) => async (dispatch) => {
    try {
        dispatch({ type: RESET_CLOUD_PASSWORD_REQUEST });

        await axios.post("/api/auth/reset-cloud-passwd", { token, password });

        dispatch({ type: RESET_CLOUD_PASSWORD_SUCCESS });
    } catch (error) {
        dispatch({
            type: RESET_CLOUD_PASSWORD_FAIL,
            payload:
                error.response && error.response.data
                    ? error.response.data
                    : error.message,
        });
    }
};

export const logout = () => async (dispatch) => {
    await axios.put("/logout");

    localStorage.removeItem("userToken");
    dispatch({ type: USER_LOGOUT });

};

export const mobilePage = () => (dispatch) => {
    dispatch({ type: USER_MOBILE_PAGE, pageStep: 1 });
};
