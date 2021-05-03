import { GET_ERRORS, CLEAR_ERRORS } from "../constants/errorConstants";

export const errorReducer = ( state = {}, action ) => dispatch => {
    switch (action.type) {
        case GET_ERRORS:
            return {
                ...state, message: action.playload.msg, status: action.playload.status
            }
        case CLEAR_ERRORS:
            return state = {}
        default:
            return state;
    }
}