import { GET_ERRORS, CLEAR_ERRORS } from '../constants/errorConstants'

export const retrunErrors = (msg, status, id = null) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status, id }
    }
}

export const clearErrors = () => {
    return {
        type:CLEAR_ERRORS
    }
}