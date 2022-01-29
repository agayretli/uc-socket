import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';

dotenv.config();

const app = express();
const server: http.Server = http.createServer(app);
const PORT: number = 5000 || Number(process.env.PORT);

app.get('/', (res: { json: (arg0: { message: string }) => void }) => {
    res.json({ message: 'User Communication Socket Server' });
});

const io: socketIO.Server = new socketIO.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on('connection', (socket: socketIO.Socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('ping', (cb) => {
        console.log('ping');
        cb();
    });
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(PORT, () => {
    console.log(`Running at port *:${PORT}`);
});
