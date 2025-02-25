const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update this if needed
    methods: ["GET", "POST"],
  },
});

const users = {}; // Store doctor and patient connections

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", ({ role, userId }) => {
    users[userId] = { socketId: socket.id, role };
    console.log(`${role} with ID ${userId} joined.`);

    // Find the other user (doctor or patient)
    const otherUser = Object.values(users).find(
      (user) => user.role !== role
    );

    // Notify the other user that someone is online
    if (otherUser) {
      io.to(otherUser.socketId).emit("receiveMessage", {
        senderId: "System",
        message: `${role === "doctor" ? "Doctor" : "Patient"} is now online.`,
      });
    }
  });

  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiver = users[receiverId];
    if (receiver) {
      io.to(receiver.socketId).emit("receiveMessage", { senderId, message });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    let disconnectedUser = null;
    for (const userId in users) {
      if (users[userId].socketId === socket.id) {
        disconnectedUser = users[userId];
        delete users[userId];
        break;
      }
    }

    // Notify the other user if a doctor or patient disconnects
    if (disconnectedUser) {
      const otherUser = Object.values(users).find(
        (user) => user.role !== disconnectedUser.role
      );

      if (otherUser) {
        io.to(otherUser.socketId).emit("receiveMessage", {
          senderId: "System",
          message: `${disconnectedUser.role === "doctor" ? "Doctor" : "Patient"} has disconnected.`,
        });
      }
    }
  });
});

const PORT = process.env.PORT || 5001; // Change to 5001 or another free port

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});