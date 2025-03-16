// import React, { useState, useEffect, useRef } from "react";
// import io from "socket.io-client";

// // Create socket with explicit connection options
// const socketInitializer = () => {
//   return io("http://localhost:9000", {
//     withCredentials: true,
//     transports: ['websocket', 'polling'],
//     reconnectionAttempts: 5,
//     reconnectionDelay: 1000
//   });
// };

// const ChatApp = () => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const [connected, setConnected] = useState(false);
//   const [socket, setSocket] = useState(null);
//   const chatBoxRef = useRef(null);

//   // Initialize socket connection
//   useEffect(() => {
//     const newSocket = socketInitializer();
//     setSocket(newSocket);

//     // Setup connection status handlers
//     newSocket.on("connect", () => {
//       console.log("Connected to server with ID:", newSocket.id);
//       setConnected(true);
//     });

//     newSocket.on("connect_error", (err) => {
//       console.error("Connection error:", err.message);
//       setConnected(false);
//     });

//     newSocket.on("disconnect", (reason) => {
//       console.log("Disconnected from server. Reason:", reason);
//       setConnected(false);
//     });

//     // Clean up on component unmount
//     return () => {
//       console.log("Cleaning up socket connection");
//       newSocket.off("connect");
//       newSocket.off("connect_error");
//       newSocket.off("disconnect");
//       newSocket.off("message");
//       newSocket.disconnect();
//     };
//   }, []);

//   // Setup message listener
//   useEffect(() => {
//     if (!socket) return;

//     // Listen for incoming messages
//     socket.on("message", (msg) => {
//       console.log("Received message:", msg);
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });

//     return () => {
//       socket.off("message");
//     };
//   }, [socket]);

//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     if (chatBoxRef.current) {
//       chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const sendMessage = (e) => {
//     e && e.preventDefault(); // Prevent form submission
    
//     if (message.trim() && connected && socket) {
//       const newMessage = {  text: message.trim() };
//       console.log("Sending message:", newMessage);
//       socket.emit("user-message", newMessage);
//       setMessage("");
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       sendMessage();
//     }
//   };

//   return (
//     <div style={styles.chatContainer}>
//       <h2 style={styles.header}>Doctor Chat</h2>
//       <div style={styles.connectionStatus}>
//         Status: {connected ? (
//           <span style={{color: "green"}}>Connected</span>
//         ) : (
//           <span style={{color: "red"}}>Disconnected</span>
//         )}
//       </div>
//       <div style={styles.chatBox} ref={chatBoxRef}>
//         {messages.length === 0 ? (
//           <div style={styles.emptyChat}>No messages yet. Start a conversation!</div>
//         ) : (
//           messages.map((msg, index) => (
//             <div
//               key={index}
//               style={{
//                 ...styles.message,
//                 alignSelf: msg.sender === "Doctor" ? "flex-start" : "flex-end",
//                 backgroundColor: msg.sender === "Doctor" ? "#f1f1f1" : "#4CAF50",
//                 color: msg.sender === "Doctor" ? "#000" : "#fff",
//               }}
//             >
//               <strong>{msg.sender}: </strong> {msg.text}
//             </div>
//           ))
//         )}
//       </div>
//       <form onSubmit={sendMessage} style={styles.inputContainer}>
//         <input
//           type="text"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Type a message..."
//           style={styles.input}
//           disabled={!connected}
//         />
//         <button 
//           type="submit" 
//           style={{
//             ...styles.sendButton,
//             opacity: connected ? 1 : 0.5
//           }}
//           disabled={!connected}
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// const styles = {
//   chatContainer: {
//     width: "400px",
//     margin: "50px auto",
//     padding: "20px",
//     border: "1px solid #ccc",
//     borderRadius: "10px",
//     fontFamily: "Arial, sans-serif",
//     boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: "10px",
//     color: "#333",
//   },
//   connectionStatus: {
//     textAlign: "center",
//     marginBottom: "10px",
//     fontSize: "14px",
//     padding: "5px",
//     backgroundColor: "#f8f8f8",
//     borderRadius: "5px",
//   },
//   chatBox: {
//     display: "flex",
//     flexDirection: "column",
//     height: "300px",
//     overflowY: "auto",
//     padding: "10px",
//     border: "1px solid #ddd",
//     borderRadius: "5px",
//     backgroundColor: "#f9f9f9",
//   },
//   emptyChat: {
//     textAlign: "center",
//     color: "#888",
//     marginTop: "130px",
//   },
//   message: {
//     padding: "8px 12px",
//     borderRadius: "15px",
//     maxWidth: "70%",
//     marginBottom: "10px",
//     boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
//     wordBreak: "break-word",
//   },
//   inputContainer: {
//     display: "flex",
//     marginTop: "10px",
//   },
//   input: {
//     flex: 1,
//     padding: "10px",
//     border: "1px solid #ccc",
//     borderRadius: "20px",
//     outline: "none",
//   },
//   sendButton: {
//     padding: "10px 15px",
//     marginLeft: "5px",
//     backgroundColor: "#007BFF",
//     color: "#fff",
//     border: "none",
//     borderRadius: "20px",
//     cursor: "pointer",
//     fontWeight: "bold",
//   },
// };

// export default ChatApp;