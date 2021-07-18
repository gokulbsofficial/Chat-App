import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import MobileScreen from "../screens/authScreens/MobileScreen";
import VerifyOtpScreen from "../screens/authScreens/VerifyOtpScreen";
import ProfileScreen from "../screens/authScreens/ProfileScreen";
import CloudPasswordScreen from "../screens/authScreens/CloudPasswordScreen";
import {
  makeConnectAuthSocket,
  authSocketEmittedAction,
} from "../actions/authAction";
import { authListenerEvents } from "../socketIo/authSocket";

export let authSocketEmitted;
const StepForm = (props) => {
  const history = useHistory();
  const { search } = useLocation();

  let redirect = search ? search.split("=")[1] : "/";

  const [state, setState] = useState({
    mobile: `${props.mobile || ""}`,
    otp: "",
    email: "",
    password: "",
    name: "",
    userName: "",
    profilePic: "",
    redirect,
  });

  const { authInfo, userSocketInfo } = useSelector((state) => state);

  const dispatch = useDispatch();

  const pageStep = authInfo.pageStep || 1;
  const isLogin = authInfo.token || false;
  const authSocket = userSocketInfo.connected;

  const handleChange = (input, value) => {
    setState({ ...state, [input]: value });
  };

  authSocketEmitted = (data) => {
    dispatch(authSocketEmittedAction(data));
  };

  let userToken = localStorage.getItem("userToken");

  useEffect(() => {
    authListenerEvents();
    if (isLogin || userToken) {
      history.push(redirect);
    }
    if (!authSocket) {
      dispatch(makeConnectAuthSocket(userToken, authSocket));
    }
  }, [history, isLogin, redirect, authSocket, dispatch, userToken]);

  const value = state;

  switch (pageStep) {
    case 1:
      return <MobileScreen handleChange={handleChange} value={value} />;
    case 2:
      return <VerifyOtpScreen handleChange={handleChange} value={value} />;
    case 3:
      return <ProfileScreen handleChange={handleChange} value={value} />;
    case 4:
      return (
        <CloudPasswordScreen
          handleChange={handleChange}
          pageName="Cloud Password"
          value={value}
        />
      );
    case 5:
      return (
        <CloudPasswordScreen
          handleChange={handleChange}
          pageName="Password Resent Token"
          value={value}
        />
      );
    default:
      return <MobileScreen handleChange={handleChange} value={value} />;
  }
};
export default StepForm;
