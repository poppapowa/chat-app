import { createServer } from "http";
import { Server } from "socket.io";


const httpserver = createServer()

const io = new Server(httpserver, {
    cors: {
        origin: process.env.NODE_ENV === "production" ? false : ["http://localhost:5500", "http://127.0.0.1:5500"]
    }
})

io.on('connection', socket => {
    console.log(`User ${socket.id} connected`);

    socket.on('message', data => {
        console.log(data);
        io.emit('message', `${socket.id.substring(0,5)}: ${data}`);
    })
})

httpserver.listen(3500, () => console.log('listening on port 3500'));