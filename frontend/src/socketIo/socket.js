import { io } from "socket.io-client";
import { SERVER_URL } from "../constants/commonConstants";

const URL = SERVER_URL;

export const getSocket = (namespace, config) => {
    return io(`${URL}/${namespace}`,config);
};