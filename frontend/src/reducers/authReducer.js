import {
    USER_OTP_REQUEST,
    USER_OTP_FAIL,
    USER_OTP_SUCCESS,
    USER_OTP_VERIFY_REQUEST,
    USER_OTP_VERIFY_SUCCESS,
    USER_OTP_VERIFY_FAIL,
    USER_MOBILE_PAGE,
    GET_TOKEN_SUCCESS,
    USER_LOGIN_SUCCESS,
    USER_LOGOUT,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    CLOUD_PASSWORD_REQUEST,
    CLOUD_PASSWORD_SUCCESS,
    CLOUD_PASSWORD_FAIL,
    FORGET_CLOUD_PASSWORD_REQUEST,
    FORGET_CLOUD_PASSWORD_SUCCESS,
    FORGET_CLOUD_PASSWORD_FAIL,
    RESET_CLOUD_PASSWORD_REQUEST,
    RESET_CLOUD_PASSWORD_SUCCESS,
    RESET_CLOUD_PASSWORD_FAIL,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_ERROR,
    ACCESS_TOKEN_REQUEST,
    ACCESS_TOKEN_SUCCESS,
    ACCESS_TOKEN_ERROR,
    ACCESS_TOKEN_NOTFOUND,
} from "../constants/authConstants";

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_OTP_REQUEST:
        case USER_OTP_VERIFY_REQUEST:
        case USER_PROFILE_REQUEST:
        case CLOUD_PASSWORD_REQUEST:
        case FORGET_CLOUD_PASSWORD_REQUEST:
        case RESET_CLOUD_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case USER_OTP_SUCCESS:
        case USER_OTP_VERIFY_SUCCESS:
        case USER_PROFILE_SUCCESS:
        case CLOUD_PASSWORD_SUCCESS:
        case FORGET_CLOUD_PASSWORD_SUCCESS:
        case RESET_CLOUD_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                payload: action.payload,
                pageStep: action.pageStep,
            };
        case USER_OTP_FAIL:
        case USER_OTP_VERIFY_FAIL:
        case USER_PROFILE_FAIL:
        case CLOUD_PASSWORD_FAIL:
        case FORGET_CLOUD_PASSWORD_FAIL:
        case RESET_CLOUD_PASSWORD_FAIL:
            return {
                ...state,
                loading: false,
                pageStep: action.pageStep,
                error: {
                    success: action.payload.success,
                    message: action.payload.message,
                },
            };
        case USER_MOBILE_PAGE:
            return {
                ...state,
                pageStep: action.pageStep,
            };
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                loginStatus: true,
            };
        case GET_USER_REQUEST:
            return {
                ...state,
                isLogin: false,
                loading: true,
            };
        case GET_USER_SUCCESS:
            return {
                ...state,
                isLogin: true,
                loading: false,
                user: action.payload.user,
            };
        case GET_USER_ERROR:
            return {
                ...state,
                loading: false,
                isLogin: false,
                error: {
                    success: action.payload.success,
                    message: action.payload.message,
                },
            };
        case GET_TOKEN_SUCCESS:
            return {
                ...state,
                isLogin: true,
                loading: false,
                token: action.payload,
            };
        case ACCESS_TOKEN_REQUEST:
            return {
                ...state,
                loading: true,
                accessToken: false,
            };
        case ACCESS_TOKEN_SUCCESS:
            return {
                ...state,
                loading: false,
                accessToken: true,
            };
        case ACCESS_TOKEN_ERROR:
        case ACCESS_TOKEN_NOTFOUND:
            return {
                ...state,
                loading: false,
                accessToken: false,
                error: {
                    success: action.payload.success,
                    message: action.payload.message,
                },
            };
        case USER_LOGOUT:
            return state = {}
        default:
            return state;
    }
};
