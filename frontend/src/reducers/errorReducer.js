import { GET_ERRORS, CLEAR_ERRORS } from "../constants/errorConstants";

export const errorReducer = ( state = {}, action )  => {
    switch (action.type) {
        case GET_ERRORS:
            console.log(1);
            return {
                ...state, id: action.payload.id, message: action.payload.msg, status: action.payload.statusCode
            }
        case CLEAR_ERRORS:
            return state = {}
        default:
            return state;
    }
}