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

    socket.on('sendEmailOnLogin', (email) => {
        console.log('sendEmailOnLogin');
        console.log(email);
        socket.data.email = email;
        console.log(socket.data.email);
        io.sockets.emit('userLogin', email);
    });

    socket.on('getActiveUsers', async (callback) => {
        const clients = await io.fetchSockets();
        const emails = [];
        for (let i = 0; i < clients.length; i += 1) {
            emails.push(clients[i].data.email);
        }
        console.log(emails);
        callback({
            users: emails,
        });
    });
});

server.listen(PORT, () => {
    console.log(`Running at port *:${PORT}`);
});
