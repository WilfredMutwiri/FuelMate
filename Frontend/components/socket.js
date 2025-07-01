import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { SERVER_URI } from "../constants/SERVER_URI";

const socket = io(SERVER_URI, {
  transports: ["websocket"],
  autoConnect: false,
});

export default socket;
