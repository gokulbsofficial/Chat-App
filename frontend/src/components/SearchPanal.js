import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversationAction } from "../actions/userActions";
import Loader from "../components/Loader";
// import Inboxes from "./Inboxes";

function SearchPanal({ openChat }) {
  const { searchInfo, conversationInfo } = useSelector((state) => state);
  const { searchUsers, loading } = searchInfo;
  const { convId } = conversationInfo;

  const dispatch = useDispatch();
  const openConversation = (sender, type, convID = null) => {
    if (convId !== convID) {
      openChat();
      dispatch(getConversationAction({ sender, type, convId: convID }));
    }
  };
  return (
    <div>
      <h1>{searchUsers && "Global search"}</h1>
      {loading ? (
        <div className="loader-wrapper">
          <Loader size={40} />
        </div>
      ) : (
        searchUsers &&
        searchUsers.map((obj) => (
          <div
            className="search-user"
            key={obj._id}
            onClick={() => openConversation(obj, "private-chat")}
          >
            <div className="profile">
              <img
                className="profile_pic "
                src={obj.profilePic ? obj.profilePic : "/images/users/user.png"}
                alt="profile"
              />
            </div>
            <div className="user_details">
              <h4 className="user_name">{obj.name}</h4>
              <p className="user_about">{`@${obj.userName}`}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchPanal;
