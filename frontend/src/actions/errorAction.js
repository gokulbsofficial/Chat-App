import { GET_ERRORS, CLEAR_ERRORS } from "../constants/errorConstants";

export const retrunErrors =
  (msg = `Server Error!!! `, success = false , id = null) => {
    return {
      type: GET_ERRORS,
      payload: { msg, success, id },
    };
  };

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};