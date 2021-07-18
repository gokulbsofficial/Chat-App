import { useEffect, useState } from "react";
import MenuArea from "../../components/MenuArea";
import ResentChat from "../../components/ResentChat";
import ChatInfo from "../../components/ChatInfo";
import { userListenerEvents } from "../../socketIo/userSocket";
// import { checkRefreshToken } from "../../../actions/authAction";
import {
  getUserAction,
  makeConnectUserSocket,
  userSocketEmittedAction,
} from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";

export let userSocketEmitted;

const HomeScreen = () => {
  const dispatch = useDispatch();

  const { authInfo, userSocketInfo } = useSelector((state) => state);

  const { token } = authInfo;
  const userSocket = userSocketInfo.connected;
  const [width] = useState(window.innerWidth);
  const [mobileView, setMobileView] = useState(false);
  const [show, setShow] = useState(false);

  const openChat = (id) => {
    setShow(true);
  };
  const closeChat = (id) => {
    setShow(false);
  };

  userSocketEmitted = (data) => {
    dispatch(userSocketEmittedAction(data));
  };
  
  
  userListenerEvents();
  useEffect(() => {
    if (width <= 960) {
      setMobileView(true);
    }
    if (!userSocket && token) {
      dispatch(makeConnectUserSocket(token, userSocket));
    }
    if (userSocket) {
      // if(!token){
      //   dispatch(checkRefreshToken());
      // }
      if (token) {
        dispatch(getUserAction());
      }
    }
  }, [token, dispatch, userSocket, width]);

  return (
    <section className="home_page">
      <section className="main">
        <MenuArea />
        <ResentChat state={{ mobileView, show, openChat }} />
        <ChatInfo state={{ mobileView, show, closeChat }} />
      </section>
    </section>
  );
};

export default HomeScreen;
