import React from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useChat from "../hooks/useChat";
import ChatUI from "./ChatApp";

function FinalChat() {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const role = searchParams.get("role");
  const receiverId = searchParams.get("receiver"); // ID of the person you're chatting with

  const { messages, sendMessage } = useChat(userId, role);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    sendMessage(receiverId, newMessage);
    setNewMessage("");
  };

  return (
    <ChatUI
      messages={messages}
      newMessage={newMessage}
      setNewMessage={setNewMessage}
      handleSendMessage={handleSendMessage}
    />
  );
}

export default FinalChat;