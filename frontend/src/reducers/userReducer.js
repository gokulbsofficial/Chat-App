import {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_ERROR,
  CLEAR_USER_INFO,
  GET_USER_INBOXES_REQUEST,
  GET_USER_INBOXES_SUCCESS,
  GET_USER_CHAT_REQUEST,
  GET_USER_CHAT_SUCCESS,
  GET_USER_CHAT_FAIL,
  GET_USER_INBOXES_FAIL,
  GET_SEARCH_REQUEST,
  GET_SEARCH_SUCCESS,
  GET_SEARCH_FAIL,
  CLEAR_SEARCH_INFO,
  CLEAR_USER_CHAT,
  CLEAR_USER_INBOXES,
  SET_SENDER_DATA,
  GET_CHAT_SUCCESS,
  GET_CHAT_FAIL,
  GET_CHAT_REQUEST,
  CLEAR_CHAT_INFO,
  CREATE_CONVERSATION_SUCCESS,
  CREATE_CONVERSATION_FAIL,
  SENDED_MSG_FAIL,
  SENDED_MSG_SUCCESS,
  RECIEVED_MSG_SUCCESS,
  NEW_INBOX_ARRIVED,
} from "../constants/userConstants";

export const userReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        user: action.payload.user,
      };
    case GET_USER_ERROR:
      return {
        ...state,
        loading: false,
        error: {
          success: action.payload.success,
          message: action.payload.message,
        },
      };
    case CLEAR_USER_INFO:
      return (state = {});
    default:
      return state;
  }
};

export const chatReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        chats: action.payload.chats,
      };
    case GET_USER_CHAT_FAIL:
      return {
        ...state,
        loading: false,
      };
    case CLEAR_USER_CHAT:
      return (state = {});
    default:
      return state;
  }
};

export const inboxReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USER_INBOXES_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_USER_INBOXES_SUCCESS:
      return {
        ...state,
        loading: false,
        inboxes: action.payload.inboxes,
      };
    case NEW_INBOX_ARRIVED:
      let inboxes = [action.payload.newInbox,...state.inboxes]
      return {
        ...state,
        inboxes
      }
    case GET_USER_INBOXES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_USER_INBOXES:
      return (state = {});

    default:
      return state;
  }
};

export const searchReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        searchUsers: action.payload.users,
      };
    case GET_SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case CLEAR_SEARCH_INFO:
      return (state = {});
    default:
      return state;
  }
};

export const conversationReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_SENDER_DATA:
      return {
        ...state,
        loading: false,
        sender: action.payload.sender,
        convId: action.payload.convId,
        type: action.payload.type,
      };
    case GET_CHAT_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: action.payload.messages,
        members:action.payload.members,
        roles:action.payload.roles
      };
    case CREATE_CONVERSATION_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: action.payload.messages,
        convId: action.payload.convId,
      };
    case GET_CHAT_FAIL:
    case CREATE_CONVERSATION_FAIL:
    case SENDED_MSG_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case SENDED_MSG_SUCCESS:
    case RECIEVED_MSG_SUCCESS:
      let messages = [...state.messages,action.payload.message]
      console.log(messages);
      return {
        ...state,
        messages,
      };
    case CLEAR_CHAT_INFO:
      return (state = {});
    default:
      return state;
  }
};
