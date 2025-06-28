import React, { useEffect } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import socket from "../components/socket";
import useAuthStore from "../zustand/store";

export default function NotificationListener() {
  const { setHasUnreadNotifications } = useAuthStore();
  
  useEffect(() => {
    console.log("Connecting socket...");
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to socket server with id:", socket.id);
    });

    socket.on("notification", (data) => {
      Toast.show({
        type: "success",
        text1: data.title || "New Notification",
        text2: data.message,
      });
        setHasUnreadNotifications(true);
    });

    return () => {
      console.log("Disconnecting socket...");
      socket.off("notification");
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  return <View />;
}
