import { GET_ERRORS, CLEAR_ERRORS } from "../constants/errorConstants";

export const retrunErrors =
  (msg = `Try again!!! `, statusCode = null , id = null) => {
    return {
      type: GET_ERRORS,
      payload: { msg, statusCode, id },
    };
  };

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};