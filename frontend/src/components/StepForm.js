import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import MobileScreen from "./screens/authScreens/MobileScreen";
import VerifyOtpScreen from "./screens/authScreens/VerifyOtpScreen";
import ProfileScreen from "./screens/authScreens/ProfileScreen";
import CloudPasswordScreen from "./screens/authScreens/CloudPasswordScreen";
import { getUserAction, checkRefreshToken } from "../actions/authAction";

const StepForm = (props) => {
    const history = useHistory();
    const location = useLocation()

    let redirect = location.search ? location.search.split("=")[1] : "/"

    const [state, setState] = useState({
        mobile: `${props.mobile || ""}`,
        otp: "",
        email: "",
        cloudPassword: "",
        name: "",
        userName: "",
        profilePic: "",
    });

    const { authInfo } = useSelector((state) => state);

    const dispatch = useDispatch()

    const pageStep = authInfo.pageStep || 6;
    const isLogin = authInfo.isLogin || false;

    const handleChange = (input, value) => {
        setState({ ...state, [input]: value });
    };

    let userToken = localStorage.getItem("userToken")

    useEffect(() => {
        if (userToken && !isLogin) {
            dispatch(getUserAction())
            dispatch(checkRefreshToken())
        }
        if (isLogin) {
            history.push(redirect)
        }
    }, [history, isLogin, redirect, userToken, dispatch]);

    const {
        mobile,
        otp,
        email,
        cloudPassword,
        name,
        userName,
        profilePic,
    } = state;
    const value = {
        mobile,
        otp,
        email,
        cloudPassword,
        name,
        userName,
        profilePic,
    };

    switch (pageStep) {
        case 1:
            return <MobileScreen handleChange={handleChange} value={value} />;
        case 2:
            return <VerifyOtpScreen handleChange={handleChange} value={value} />;
        case 3:
            return <ProfileScreen handleChange={handleChange} value={value} />;
        case 4:
            return <CloudPasswordScreen handleChange={handleChange} pageName="Cloud Password" value={value} />;
        case 5:
            return <CloudPasswordScreen handleChange={handleChange} pageName="Password Resent Token" value={value} />;
        default:
            return <MobileScreen handleChange={handleChange} value={value} />;
    }
};
export default StepForm;
