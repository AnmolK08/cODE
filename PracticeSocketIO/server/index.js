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

//normal message send 
// io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);
//     io.emit("message", "hello from server ");

//     socket.on("message", (data) => {
//         socket.emit("message", `lucy : ${data}`);
//     });

// });


const activeUsers = new Map();

export function getRecieverSocketId(userId) {
  return activeUsers.get(userId);
}

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    const userId = socket.handshake.query.userId;
    if (userId) {
        activeUsers.set(userId, socket.id);
    }

    socket.on("message",(data) => {
        console.log(data);

        const receiverSocketId =getRecieverSocketId(data.recieverID);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("message", `${data.senderID} : ${data.message}`);
        }
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        if (userId) {
            activeUsers.delete(userId);
        }
    });
});



httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});