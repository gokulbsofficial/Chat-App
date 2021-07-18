import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  CLEAR_USER_INFO,
  GET_USER_INBOXES_REQUEST,
  GET_USER_INBOXES_SUCCESS,
  GET_USER_INBOXES_FAIL,
  GET_SEARCH_REQUEST,
  GET_SEARCH_SUCCESS,
  GET_SEARCH_FAIL,
  CLEAR_SEARCH_INFO,
  SET_SENDER_DATA,
  GET_CHAT_REQUEST,
  GET_CHAT_SUCCESS,
  GET_CHAT_FAIL,
  CREATE_CONVERSATION_SUCCESS,
  CREATE_CONVERSATION_FAIL,
  RECIEVED_MSG_SUCCESS,
  SENDED_MSG_SUCCESS,
  SENDED_MSG_FAIL,
  NEW_INBOX_ARRIVED,
} from "../constants/userConstants";
import {
  RECIEVED_MESSAGE_EVENT,
  NEW_INBOX_ARRIVED_EVENT,
  USER_SOCKET_DISCONNECT,
  USER_SOCKET_DISCONNECTED,
  USER_SOCKET_CONNECT,
  USER_SOCKET_CONNECTED,
  CONNECT_EVENT,
  DISCONNECT_EVENT,
  ERROR_EVENT,
  USER_SOCKET_ERROR
} from "../constants/userSocketConstants";
import {
  AUTH_SOCKET_CONNECT,
  AUTH_SOCKET_DISCONNECT,
} from "../constants/authSocketConstants";
import { CLEAR_AUTH_INFO } from "../constants/authConstants";
import {
  connectUserSocket,
  getUserData,
  logoutSocket,
  disconnectUserScoket,
  getUserInboxes,
  getSearchData,
  getUserConversation,
  createConversation,
  sendMsgSocket,
} from "../socketIo/userSocket";
import {
  connectAuthSocket,
  disconnectAuthScoket,
} from "../socketIo/authSocket";
import { clearErrors, retrunErrors } from "./errorAction";

// Get token & load User
export const getUserAction = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_USER_REQUEST });

    const token = getState().authInfo.token;

    if (!token) {
      dispatch(userLogoutAction());
    }

    let { data } = await getUserData(token);

    dispatch({ type: GET_USER_SUCCESS, payload: data });
  } catch (error) {
    dispatch(
      retrunErrors(
        `${error.msg ? error.msg : error.message}`,
        error.success,
        "GET_USER_ERROR"
      )
    );
    dispatch({
      type: GET_USER_ERROR,
    });
    if (error?.msg === "Not authorized please login again") {
      dispatch(userLogoutAction());
    }
  }
};

export const makeConnectUserSocket =
  (token, userSocket) => async (dispatch, getState) => {
    try {
      const authSocket = getState().authSocketInfo.connected;
      if (token) {
        if (!userSocket) {
          await connectUserSocket(token);
          dispatch({ type: USER_SOCKET_CONNECT });
          if (authSocket) {
            await disconnectAuthScoket();
            dispatch({ type: AUTH_SOCKET_DISCONNECT });
          }
        }
      } else {
        dispatch(userLogoutAction());
        await dispatch(connectAuthSocket());
        dispatch({ type: AUTH_SOCKET_CONNECT });
      }
    } catch (error) {
      dispatch(
        retrunErrors(
          `${error.msg ? error.msg : error.message}`,
          error.success,
          "USER_SOCKET_FAIL"
        )
      );

      // dispatch(userLogoutAction());
      console.log(error);
    }
  };

export const userLogoutAction = () => async (dispatch) => {
  await logoutSocket();

  localStorage.removeItem("userToken");
  clearErrors();
  dispatch({ type: CLEAR_USER_INFO });
  dispatch({ type: CLEAR_AUTH_INFO });
  await disconnectUserScoket();
  dispatch({ type: USER_SOCKET_DISCONNECT });
};

export const userInboxAction = () => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_INBOXES_REQUEST });

    let { data } = await getUserInboxes();

    dispatch({ type: GET_USER_INBOXES_SUCCESS, payload: data });
  } catch (error) {
    dispatch(
      retrunErrors(
        `${error.msg ? error.msg : error.message}`,
        error.success,
        "GET_USER_INBOXES_FAIL"
      )
    );
    dispatch({
      type: GET_USER_INBOXES_FAIL,
    });
  }
};

export const userSearchAction = (quary, userId) => async (dispatch) => {
  try {
    dispatch({ type: GET_SEARCH_REQUEST });

    let { data } = await getSearchData(quary, userId);

    dispatch({ type: GET_SEARCH_SUCCESS, payload: data });
  } catch (error) {
    dispatch(
      retrunErrors(
        `${error.msg ? error.msg : error.message}`,
        error.success,
        "GET_SEARCH_FAIL"
      )
    );
    dispatch({
      type: GET_SEARCH_FAIL,
    });
  }
};

export const clearSearchInfo = () => (dispatch) => {
  dispatch({ type: CLEAR_SEARCH_INFO });
};

export const getConversationAction =
  ({ sender, type, convId }) =>
  async (dispatch) => {
    try {
      dispatch({ type: SET_SENDER_DATA, payload: { sender, convId, type } });
      dispatch({ type: GET_CHAT_REQUEST });
      if (convId) {
        const { data } = await getUserConversation({
          senderId: sender._id,
          type,
          convId,
        });
        dispatch({ type: GET_CHAT_SUCCESS, payload: data });
      } else {
        dispatch({
          type: GET_CHAT_SUCCESS,
          payload: { data: { messages: [] } },
        });
      }
    } catch (error) {
      dispatch(
        retrunErrors(
          `${error.msg ? error.msg : error.message}`,
          error.success,
          "GET_CHAT_FAIL"
        )
      );
      dispatch({ type: GET_CHAT_FAIL });
    }
  };

export const createConversationAction = (createData) => async (dispatch) => {
  try {
    let { data } = await createConversation(createData);
    dispatch({ type: CREATE_CONVERSATION_SUCCESS, payload: data });
  } catch (error) {
    dispatch(
      retrunErrors(
        `${error.msg ? error.msg : error.message}`,
        error.success,
        "CREATE_CONVERSATION_FAIL"
      )
    );
    dispatch({ type: CREATE_CONVERSATION_FAIL });
  }
};

export const sentMessageAction = (sentData) => async (dispatch) => {
  try {
    let { data } = await sendMsgSocket(sentData);
    console.log(data)
    dispatch({ type: SENDED_MSG_SUCCESS, payload: data });
  } catch (error) {
    dispatch(
      retrunErrors(
        `${error.msg ? error.msg : error.message}`,
        error.success,
        "SENDED_MSG_FAIL"
      )
    );
    dispatch({ type: SENDED_MSG_FAIL });
  }
};

export const userSocketEmittedAction =
  ({ data, Event }) =>
  (dispatch) => {
    switch (Event) {
      case RECIEVED_MESSAGE_EVENT: {
        console.log("RECIEVED_MSG_SUCCESS",data)
        dispatch({ type: RECIEVED_MSG_SUCCESS, payload: data });
        break;
      }
      case NEW_INBOX_ARRIVED_EVENT: {
        dispatch({ type: NEW_INBOX_ARRIVED, payload: data });
        break;
      }
      case CONNECT_EVENT: {
        dispatch({ type: USER_SOCKET_CONNECTED, payload: data });
        break;
      }
      case DISCONNECT_EVENT: {
        dispatch({ type: USER_SOCKET_DISCONNECTED, payload: data });
        break;
      }
      case ERROR_EVENT: {
        dispatch({ type: USER_SOCKET_ERROR, payload: data });
        break;
      }
      default: {
        break;
      }
    }
  };
