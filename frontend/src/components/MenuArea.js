function MenuArea() {
    return (
        <div className="menu-area">
            <div className="menu-container">
                <div className="menu-bar-icon">
                    <i className="fa fa-bars" aria-hidden="true"></i>
                </div>
                <div className="all-chats-icon menu-icons">
                    <i className="far fa-comments icons"></i>
                    <p className="icon-name">All chats</p>
                </div>
                <div className="groups-icon menu-icons">
                    <i className="far fa-folder icons"></i>
                    <p className="icon-name">Groups</p>
                </div>
                <div className="personal-icon menu-icons">
                    <i className="far fa-user icons"></i>
                    <p className="icon-name">Personal</p>
                </div>
                <div className="unread-icon menu-icons">
                    <i className="far fa-comment icons"></i>
                    <p className="icon-name">Unread</p>
                </div>
                <div className="edit-icon menu-icons">
                    <i className="far fa-edit icons"></i>
                    <p className="icon-name">Edit</p>
                </div>
            </div>
        </div>
    )
}

export default MenuArea
