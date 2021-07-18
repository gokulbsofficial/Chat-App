import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSearchInfo, userSearchAction } from "../actions/userActions";
import Inboxes from "../components/Inboxes";
import SearchPanal from "../components/SearchPanal";
import { WEB_APP_NAME } from "../constants/commonConstants";

function ResentChat({ state }) {
  let { mobileView, show, openChat } = state;
  const [isSearch, setIsSearch] = useState(false);
  const [menuBar, setMenuBar] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userInfo);
  const onHandleChange = ({ target }) => {
    if (target.value === "") {
      if (!mobileView && isSearch) {
        setIsSearch(!isSearch);
      }
      dispatch(clearSearchInfo());
    } else {
      if (!mobileView && !isSearch) {
        setIsSearch(!isSearch);
      }
      dispatch(userSearchAction(target.value, user._id));
    }
  };
  return (
    <div className="left-area" id={`${mobileView && show && "hidden"}`}>
      <div className="recent-chat-info">
        <div className="recent-chat-info-top">
          <div className="ico">
            <div
              className="menu-bar-icon"
              id={`${isSearch && "hidden"}`}
              onClick={() => setMenuBar(!menuBar)}
            >
              <i className="fa fa-bars" aria-hidden="true"></i>
            </div>

            <div className="logo" id={`${isSearch && "hidden"}`}>
              <h2 className="logo-title noselect">{WEB_APP_NAME}</h2>
            </div>

            <div
              className="search-icon"
              id={`${isSearch && "hidden"}`}
              onClick={() => setIsSearch(!isSearch)}
            >
              <i className="fa fa-search" aria-hidden="true"></i>
            </div>

            <div
              className="left-arrow-icon"
              id={`${!isSearch && "hidden"}`}
              onClick={() => setIsSearch(!isSearch)}
            >
              <i className="fas fa-arrow-left"></i>
            </div>

            <div className="search-chats" id={`${!isSearch && "hidden"}`}>
              <input
                type="search"
                name="searchChats"
                id="search"
                placeholder="Search..."
                onChange={(e) => onHandleChange(e)}
                onClick={() => !isSearch && setIsSearch(true)}
              />
            </div>
          </div>
        </div>

        <div className="menu-panel">
          <nav>
            <ul>
              <li className="menu-options active">
                <button>All</button>
              </li>
              <li className="menu-options">
                <button>Groups</button>
              </li>
              <li className="menu-options">
                <button>Personal</button>
              </li>
              <li className="menu-options">
                <button>Unread</button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="recent-chats">
          {isSearch ? (
            <SearchPanal openChat={openChat} mobileView={mobileView} />
          ) : (
            <Inboxes openChat={openChat} mobileView={mobileView} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ResentChat;
