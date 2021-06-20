import React from 'react'

function ResentChat() {
    return (
        <div className="left-area" >
                <div className="recent-chat-info">

                    <div className="recent-chat-info-top">

                        <div className="ico">

                            <div className="menu-bar-icon">
                                <i className="fa fa-bars" aria-hidden="true"></i>
                            </div>

                            <div className="logo">
                                <h2 className="logo-title noselect">
                                    Chat App
                                </h2>
                            </div>

                            <div className="search-icon">
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </div>

                            <div className="left-arrow-icon" id="hidden">
                                <i className="fas fa-arrow-left"></i>
                            </div>

                            <div className="search-chats" id="hidden">
                                <input type="search" name="searchChats" id="search" placeholder="Search..." />
                            </div>
                        </div>
                    </div>

                    <div className="menu-panel">
                        <nav>
                            <ul>
                                <li className="menu-options active"><button>All</button></li>
                                <li className="menu-options"><button>Groups</button></li>
                                <li className="menu-options"><button>Personal</button></li>
                                <li className="menu-options"><button>Unread</button></li>
                            </ul>
                        </nav>
                    </div>

                    <div className="recent-chats">

                        <div className="private-chat">
                            <div className="profile">
                                <img className="profile_pic"
                                    src="https://images.firstpost.com/wp-content/uploads/2018/10/WhatsApp-1024.jpg"
                                    alt=""/>
                            </div>
                            <div className="chat">
                                <h4 className="user_name">Gokul</h4>
                                <p className="last_msg">Hello Sreejith</p>
                                <p className="last_msg_time">6.00 PM</p>
                                <div className="new_msg_count">
                                    <span>2</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
    )
}

export default ResentChat
