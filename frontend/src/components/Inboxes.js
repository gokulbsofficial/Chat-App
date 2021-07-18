import { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getConversationAction, userInboxAction } from "../actions/userActions";
import Loader from "../components/Loader";
import InfiniteScroll from "react-infinite-scroll-component";

function Inboxes({ openChat,mobileView }) {
  const { inboxInfo, userInfo, conversationInfo,userSocketInfo } = useSelector(
    (state) => state
  );
  const { convId } = conversationInfo;
  const { loading, inboxes } = inboxInfo;
  const { user } = userInfo;
  const userSocket = userSocketInfo.connected;

  const dispatch = useDispatch();

  const openConversation = (sender, type, convID) => {
    if (convId !== convID || mobileView) {
      openChat();
      dispatch(getConversationAction({ sender, type, convId: convID }));
    }
  };

  useEffect(() => {
    if (userSocket) {
      dispatch(userInboxAction());
    }
  }, [dispatch, userSocket]);

  return (
    <Fragment>
      {loading ? (
        <div className="loader-wrapper">
          <Loader size={40} />
        </div>
      ) : (
        inboxes &&
        user && (
          <InfiniteScroll
            dataLength={inboxes.length} //This is important field to render the next data
            // next={fetchData}
            hasMore={false}
            loader={
              <div className="loader-wrapper">
                <Loader size={40} />
              </div>
            }
          >
            {inboxes.map((inbox) => {
              if (inbox.type === "private-chat") {
                return (
                  <div
                    className="private-chat"
                    key={inbox._id}
                    onClick={() =>
                      openConversation(
                        inbox.sender,
                        inbox.type,
                        inbox.conversationId
                      )
                    }
                  >
                    <div className="profile">
                      <img
                        className="profile_pic "
                        src={
                          inbox.sender.profilePic
                            ? inbox.sender.profilePic
                            : "/images/users/user.png"
                        }
                        alt="profile"
                      />
                    </div>
                    <div className="chat_details">
                      <h4 className="user_name">{inbox.sender.name}</h4>
                      <p className="last_msg">
                        <span className="authorName">
                          {inbox.lastMsg.authorId === user._id
                            ? "You: "
                            : `${inbox.authorName}: `}
                        </span>
                        {inbox.lastMsg.message}
                      </p>
                      <p className="last_msg_time">{inbox.lastMsg.timestamp}</p>
                      <div className="new_msg_count">
                        {inbox.unseen && <span>{inbox.unseen}</span>}
                      </div>
                    </div>
                  </div>
                );
              }
              if (inbox.type === "group-chat") {
                return (
                  <div
                    className="group-chat"
                    key={inbox._id}
                    onClick={() => openChat(inbox._id)}
                  >
                    <div className="profile">
                      <img
                        className="group_pic"
                        src={
                          inbox.profilePic
                            ? inbox.profilePic
                            : "/images/users/user.png"
                        }
                        alt="profile"
                      />
                    </div>
                    <div className="chat_details">
                      <h4 className="group_name">{inbox.group_name}</h4>
                      <p className="last_msg">
                        <span className="authorName">
                          {inbox.lastMsg.authorId === user._id
                            ? "You: "
                            : `${inbox.authorName}: `}
                        </span>
                        {inbox.lastMsg}
                      </p>
                      <p className="last_msg_time">{inbox.msgTime}</p>
                      <div className="new_msg_count">
                        <span>{inbox.msgCount}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </InfiniteScroll>
        )
      )}
    </Fragment>
  );
}

export default Inboxes;