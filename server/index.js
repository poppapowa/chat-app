import express from 'express';
import { Server } from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3500;


const app = express();

// static server for hosting frontend web app on express server
app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

const io = new Server(expressServer, {
    cors: {
        // if web app is not hosted on the express server (i.e. has different domain than express server)
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
});

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);

    // upon connection - only to user
    socket.emit('message', 'Welcome to Chat App!');

    // upon connection - to all others
    socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} connected`);

    // listening for a message event
    socket.on('message', data => {
        console.log(data);
        // io.emit sends message to everyone connected to server
        io.emit('message', `${socket.id.substring(0,5)}: ${data}`);
    });

    // when user disconnects - to all others
    socket.on('disconnect', () => {
        socket.broadcast.emit('message', `User ${socket.id.substring(0,5)} disconnected`)
    });

    // listen for activity
    socket.on('activity', (data) => {
        socket.broadcast.emit('activity', data)
    });
})
