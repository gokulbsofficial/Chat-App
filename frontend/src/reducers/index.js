import { combineReducers } from "redux";
// import * as users from "./userReducer";
import * as auth from './authReducer'
import { errorReducer } from "./errorReducer";

export const reducer = combineReducers({
    authInfo: auth.userLoginReducer,
    globalError: errorReducer
});
