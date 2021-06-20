import { useEffect } from "react";
import MenuArea from "../../MenuArea";
import ResentChat from "../../ResentChat";
import ChatInfo from "../../ChatInfo";
// import { checkRefreshToken } from "../../../actions/authAction";
import {
  getUserAction,
  makeConnectUserSocket,
} from "../../../actions/userActions";

import { useDispatch, useSelector } from "react-redux";

const HomeScreen = () => {
  const dispatch = useDispatch();

  const { authInfo, userInfo } = useSelector((state) => state);

  const { token } = authInfo;
  const { userSocket } = userInfo;

  useEffect(() => {
    if (!userSocket && token) {
      dispatch(makeConnectUserSocket());
    }
    if (userSocket) {
      // if(!token){
      //   dispatch(checkRefreshToken());
      // }
      if (token) {
        dispatch(getUserAction());
      }
    }
  }, [token, dispatch, userSocket]);

  return (
    <section className="home_page">
      <section className="main">
        <MenuArea />
        <ResentChat />
        <ChatInfo />
      </section>
    </section>
  );
};

export default HomeScreen;
