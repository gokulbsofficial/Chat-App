import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createConversationAction,
  sentMessageAction,
} from "../actions/userActions";
import ChatMessage from "./ChatMessage";

function ChatInfo({ state }) {
  let { mobileView, show, closeChat } = state;
  const { conversationInfo, userInfo } = useSelector((state) => state);
  const { user } = userInfo;
  const { type, sender, messages, convId } = conversationInfo;
  const [msg, setMsg] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (msg === "") {
      return false;
    } else {
      let senderId = sender._id;
      let msgData = {
        authorId: user._id,
        message: msg,
        timestamp: `${new Date().getHours()}:${new Date().getMinutes()}`,
      };
      if (convId) {
        dispatch(
          sentMessageAction({
            senderId,
            convId,
            msgData,
            type,
          })
        );
        setMsg("");
      } else {
        dispatch(
          createConversationAction({
            senderId,
            msgData,
            type,
          })
        );
        setMsg("");
      }
    }
  };

  // const privateChatInfo = () => {
  //   if (type === "private-chat") {
  //     return (
  //       <div>
  //         <div className="profile">
  //           <img
  //             className="profile_pic"
  //             src={
  //               sender.profilePic ? sender.profilePic : "/images/users/user.png"
  //             }
  //             alt="profile"
  //           />
  //         </div>
  //         <div className="sender-detail">
  //           <h4 className="sender-name">{sender.name}</h4>
  //           <p className="sender-username">{sender.userName}</p>
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div>
  //         <div className="profile">
  //           <img
  //             className="group_pic"
  //             src={
  //               sender.profilePic ? sender.profilePic : "/images/users/user.png"
  //             }
  //             alt="profile"
  //           />
  //         </div>
  //         <div className="group-detail">
  //           <h4 className="group-name">{sender.name}</h4>
  //           <p className="group-members">{sender.userName}</p>
  //         </div>
  //       </div>
  //     );
  //   }
  // };

  return (
    <div className="right-area" id={`${mobileView && !show && "hidden"}`}>
      <div className="select-chats" id={`${!mobileView && show && "hidden"}`}>
        <div className="notice-bar"></div>
      </div>
      {sender && (
        <div className="chat-info" id={`${!mobileView && !show && "hidden"}`}>
          <div className="chat-info-top">
            <div className="back-btn" onClick={closeChat}>
              <div className="left-arrow-icon">
                <i className="fas fa-arrow-left"></i>
              </div>
            </div>

            <div className="profile">
              <img
                className="profile_pic"
                src={
                  sender.profilePic
                    ? sender.profilePic
                    : "/images/users/user.png"
                }
                alt="profile"
              />
            </div>
            <div className="sender-detail">
              <h4 className="sender-name">{sender.name}</h4>
              <p className="sender-username">{sender.userName}</p>
            </div>

            <div className="more">
              <div className="more-icon">
                <i className="fas fa-ellipsis-v"></i>
              </div>
            </div>
          </div>
          <div className="group-chats">
            {messages && (
              <ChatMessage messages={messages} userId={user._id} type={type} />
            )}
          </div>

          <div className="chat-info-bottom">
            <div className="emoji-icon circle-icon">
              <i className="far fa-smile"></i>
            </div>
            <div className="message-box">
              <form onSubmit={handleSubmit}>
                <input
                  className="messageBox"
                  type="text"
                  placeholder="Message"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
              </form>
            </div>
            <div className="paper-clip circle-icon" onClick={handleSubmit}>
              <i className="fas fa-paperclip"></i>
            </div>
            {/* <div className="paper-clip circle-icon">
              <i className="fas fa-paperclip"></i>
            </div> */}
            <div className="microphone circle-icon">
              <i className="fas fa-microphone"></i>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatInfo;
