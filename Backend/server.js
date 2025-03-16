const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: ["http://localhost:5173", "http://localhost:3000"], methods: ["GET", "POST"], credentials: true }
});

const rooms = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
        if (!rooms[roomId]) rooms[roomId] = [];
        rooms[roomId].push(socket.id);
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);

        rooms[roomId].forEach((userId) => {
            if (userId !== socket.id) {
                io.to(userId).emit("user-joined", socket.id);
            }
        });
    });

    socket.on("offer", ({ roomId, senderId, offer }) => {
        socket.to(roomId).emit("offer", { senderId, offer });
    });

    socket.on("answer", ({ roomId, senderId, answer }) => {
        socket.to(roomId).emit("answer", { senderId, answer });
    });

    socket.on("ice-candidate", ({ roomId, senderId, candidate }) => {
        socket.to(roomId).emit("ice-candidate", { senderId, candidate });
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (const roomId in rooms) {
            rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
            if (rooms[roomId].length === 0) delete rooms[roomId];
        }
    });
});

server.listen(5001, () => console.log("Server running on port 5001"));