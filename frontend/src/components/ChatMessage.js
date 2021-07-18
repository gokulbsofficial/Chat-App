import { Fragment } from "react";
import ScrollableFeed from "react-scrollable-feed";

function ChatMessage({ messages, userId, type }) {
  const changeDetectionFilter = (previousProps, newProps) => {
    const prevChildren = previousProps.children;
    const newChildren = newProps.children;

    return (
      prevChildren !== newChildren &&
      prevChildren[prevChildren.length - 1] !==
        newChildren[newChildren.length - 1]
    );
  };

  return (
    <Fragment>
      <ScrollableFeed
        changeDetectionFilter={changeDetectionFilter}
      >
        <div>
          {messages.map((chat) => {
            if (chat.authorId === userId) {
              return (
                <div className="msg msgSent" key={chat._id}>
                  {chat.message}{" "}
                  {type === "group-chat" && ` by ${chat.authorId}`}
                  <span className="timestamp readed">{chat.timestamp}</span>
                </div>
              );
            } else {
              return (
                <div className="msg msgReceived" key={chat._id}>
                  {chat.message}{" "}
                  {type === "group-chat" && ` by ${chat.authorId}`}
                  <span className="timestamp">{chat.timestamp}</span>
                </div>
              );
            }
          })}
        </div>
      </ScrollableFeed>
    </Fragment>
  );
}

export default ChatMessage;
