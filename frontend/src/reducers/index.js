import { combineReducers } from "redux";
import * as users from "./userReducer";
import * as auth from './authReducer'
import * as socket from './socketReducer'
import { errorReducer } from "./errorReducer";

export const reducer = combineReducers({
    authInfo: auth.userLoginReducer,
    userInfo: users.userReducer,
    authSocketInfo: socket.authSocketReducer,
    userSocketInfo: socket.userSocketReducer,
    chatInfo:users.chatReducer,
    inboxInfo:users.inboxReducer,
    searchInfo:users.searchReducer,
    conversationInfo:users.conversationReducer,
    globalError: errorReducer
});
