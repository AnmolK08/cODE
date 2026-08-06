import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173"
    },
});

const PORT = 3000;

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);
    io.emit("message", "hello from server ");

    socket.on("message", (data) => {
        socket.emit("message", `lucy : ${data}`);
    });

});



httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});