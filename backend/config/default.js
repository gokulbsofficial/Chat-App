require("dotenv").config();

/* SERVER CONFIG */
const SERVER_NODE_ENV = process.env.SERVER_NODE_ENV || "development";
const SERVER_WEB_APP = process.env.SERVER_WEB_APP || "ChatApp";
const SERVER_PORT = process.env.SERVER_PORT || 6000;
const SERVER_HOST = process.env.SERVER_HOST || "localhost";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:6000";
const SERVER_ACCESS_TOKEN_DURATION =
  process.env.SERVER_ACCESS_TOKEN_DURATION || "1y";
const SERVER_REFRESH_TOKEN_DURATION =
  process.env.SERVER_REFRESH_TOKEN_DURATION || "1y";
const SERVER_TOKEN_RESET_DURATION =
  process.env.SERVER_TOKEN_RESET_DURATION || "1y";
const SERVER_TOKEN_ISSUER = process.env.SERVER_TOKEN_ISSUER || "gokul_sreejith";
const SERVER_JWT_ACCESS_SECRET =
  process.env.SERVER_JWT_ACCESS_SECRET || "accessencryptedsecret";
const SERVER_JWT_REFRESH_SECRET =
  process.env.SERVER_JWT_REFRESH_SECRET || "refreshencryptedsecret";
const SERVER_JWT_RESET_SECRET =
  process.env.SERVER_JWT_RESET_SECRET || "resetencryptedsecret";

const SERVER = {
  node_env: SERVER_NODE_ENV,
  webAppName:SERVER_WEB_APP,
  port: SERVER_PORT,
  host: SERVER_HOST,
  url: SERVER_URL,
  token: {
    accessToken: {
      secret: SERVER_JWT_ACCESS_SECRET,
      expires: SERVER_ACCESS_TOKEN_DURATION,
    },
    refreshToken: {
      secret: SERVER_JWT_REFRESH_SECRET,
      expires: SERVER_REFRESH_TOKEN_DURATION,
    },
    resetToken: {
      secret: SERVER_JWT_RESET_SECRET,
      expires: SERVER_TOKEN_RESET_DURATION,
    },
    issuer: SERVER_TOKEN_ISSUER,
  },
};

/* CLIENT CONFIG */
const CLIENT_HOST = process.env.CLIENT_HOST || "localhost";
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const CLIENT = {
  host: CLIENT_HOST,
  port: CLIENT_PORT,
  url: CLIENT_URL,
};

/* MONGO CONFIG */
const MONGO_HOST = process.env.MONGO_HOST || "local";
const MONGO_USERNAME = process.env.MONGO_USERNAME || "gokul_sreejith";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "123";
const MONGO_URL = process.env.MONGO_URL || "123";

const MONGO_OPTIONS = {
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  poolSize: 50,
  autoIndex: false,
  retryWrites: true,
};

const MONGO = {
  host: MONGO_HOST,
  username: MONGO_USERNAME,
  password: MONGO_PASSWORD,
  url: MONGO_URL,
  options: MONGO_OPTIONS,
};

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || null;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || null;
const TWILIO_SERVICES_ID = process.env.TWILIO_SERVICES_ID || null;
const SMS_KEY = process.env.SMS_KEY || null;

const TWILIO = {
  accountSid: TWILIO_ACCOUNT_SID,
  servicesId: TWILIO_SERVICES_ID,
  authToken: TWILIO_AUTH_TOKEN,
  sms_key: SMS_KEY,
};

/* Socket */

const CONNECTION_EVENT = "connection";
const DISCONNECT_EVENT = "disconnect";
const ERROR_EVENT = "error";

/* AUTH SocketEvents */

const SENT_OTP_EVENT = "sent_otp";
const VERIFY_OTP_EVENT = "verify_otp";
const LOGIN_PROFILE_EVENT = "login_profile";
const CLOUD_PASSWORD_EVENT = "cloud_password";
const FORGET_PASSWORD_EVENT = "forget_password";
const RESET_PASSWORD_EVENT = "reset_password";
const REFRESH_TOKEN_EVENT = "refresh_token";
const DISCONNECT_AUTH_EVENT = "disconnect_auth";

const AUTH_SOCKET = {
  CONNECTION_EVENT,
  DISCONNECT_EVENT,
  ERROR_EVENT,
  SENT_OTP_EVENT,
  VERIFY_OTP_EVENT,
  LOGIN_PROFILE_EVENT,
  CLOUD_PASSWORD_EVENT,
  FORGET_PASSWORD_EVENT,
  RESET_PASSWORD_EVENT,
  REFRESH_TOKEN_EVENT,
  DISCONNECT_AUTH_EVENT,
};

/* USER Socket Events */

const GET_USER_EVENT = "get_user";
const GET_INBOXES_EVENT = "get_inboxes";
const SEARCH_USER_EVENT = "search_user";
const GET_CONVERSATION_EVENT = "get_conversation";
const CREATE_CONVERSATION_EVENT = "create_conversation";
const SENT_MESSAGE_EVENT = "sent_message";
const LOGOUT_EVENT = "logout";
const DISCONNECT_USER_EVENT = "disconnect_user";
const NEW_INBOX_ARRIVED_EVENT = "new_inbox_arrived";
const RECIEVED_MESSAGE_EVENT = "recieved_message";
const UNAUTHORIZED_EVENT = "unauthorized";
const CONNECT_ERROR_EVENT = "connect_error";
const RECONNECT_ATTEMPT_EVENT = "reconnect_attempt";

const USER_SOCKET = {
  CONNECTION_EVENT,
  DISCONNECT_EVENT,
  ERROR_EVENT,
  GET_USER_EVENT,
  GET_INBOXES_EVENT,
  SEARCH_USER_EVENT,
  GET_CONVERSATION_EVENT,
  CREATE_CONVERSATION_EVENT,
  SENT_MESSAGE_EVENT,
  LOGOUT_EVENT,
  DISCONNECT_USER_EVENT,
  NEW_INBOX_ARRIVED_EVENT,
  RECIEVED_MESSAGE_EVENT,
  UNAUTHORIZED_EVENT,
  CONNECT_ERROR_EVENT,
  RECONNECT_ATTEMPT_EVENT,
};

/* Config */
const config = {
  server: SERVER,
  client: CLIENT,
  mongo: MONGO,
  twilio: TWILIO,
  authSocketEvent: AUTH_SOCKET,
  userSocketEvent: USER_SOCKET,
};

module.exports = config;
