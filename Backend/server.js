const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join-room", (roomId) => {
        const roomClients = io.sockets.adapter.rooms.get(roomId) || new Set();

        if (roomClients.size < 2) {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);
            socket.to(roomId).emit("user-joined", socket.id);
        } else {
            socket.emit("room-full");
        }
    });

    socket.on("offer", ({ roomId, offer }) => {
        socket.to(roomId).emit("offer", { senderId: socket.id, offer });
    });

    socket.on("answer", ({ roomId, answer }) => {
        socket.to(roomId).emit("answer", { senderId: socket.id, answer });
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
        socket.to(roomId).emit("ice-candidate", { senderId: socket.id, candidate });
    });

    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        io.emit("user-disconnected", socket.id);
    });
});

server.listen(5001, () => console.log("Server running on port 5001"));