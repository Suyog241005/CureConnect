import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Adjust to your backend URL

export default function useChat(userId, role) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit("join", { userId, role });

    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off("receiveMessage");
  }, [userId, role]);

  const sendMessage = (receiverId, text) => {
    const messageData = { sender: userId, receiver: receiverId, text };
    socket.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]);
  };

  return { messages, sendMessage };
}