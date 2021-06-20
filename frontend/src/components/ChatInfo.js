function ChatInfo() {
    return (
            <div className="right-area">
                <div className="chat-info" id="hidden">
                    <div className="chat-info-top">
                        <div className="back-btn">
                            <div className="left-arrow-icon">
                                <i className="fas fa-arrow-left"></i>
                            </div>
                        </div>
                        <div className="profile">
                            <img className="profile_pic"
                                src="https://images.firstpost.com/wp-content/uploads/2018/10/WhatsApp-1024.jpg"
                                alt="profile" />
                        </div>
                        <div className="group-detail">
                            <h4 className="group-name">CSE Demons</h4>
                            <p className="group-members">38 members</p>
                        </div>
                        <div className="more">
                            <div className="more-icon">
                                <i className="fas fa-ellipsis-v"></i>
                            </div>
                        </div>

                    </div>
                    <div className="group-chats">

                        <div className="msg msgReceived">
                            Hello
                            <span className="timestamp">12:30 PM</span>
                        </div>

                        <div className="msg msgSent">
                            Hello
                            <span className="timestamp readed" >12:30 PM</span>
                        </div>

                        <div className="msg msgReceived">
                            Hello
                            <span className="timestamp">12:30 PM</span>
                        </div>

                        <div className="msg msgSent">
                            Hello
                            <span className="timestamp readed">12:30 PM</span>
                        </div>

                        <div className="msg msgReceived">
                            Hello
                            <span className="timestamp">12:30 PM</span>
                        </div>

                        <div className="msg msgSent">
                            Hello
                            <span className="timestamp readed">12:30 PM</span>
                        </div>

                        <div className="msg msgReceived">
                            Hello
                            <span className="timestamp ">12:30 PM</span>
                        </div>

                        <div className="msg msgSent">
                            Hello
                            <span className="timestamp">12:30 PM</span>
                        </div>

                    </div>
                    <div className="chat-info-bottom">
                        <div className="emoji-icon circle-icon">
                            <i className="far fa-smile"></i>
                        </div>
                        <div className="message-box">
                            <input className="messageBox" type="text" placeholder="Message" maxLength="30"/>
                        </div>
                        <div className="paper-clip circle-icon">
                            <i className="fas fa-paperclip"></i>
                        </div>
                        <div className="microphone circle-icon">
                            <i className="fas fa-microphone"></i>
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default ChatInfo
