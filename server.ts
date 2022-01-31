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

    socket.on('sendInfoOnLogin', (email, name) => {
        console.log('sendInfoOnLogin');
        socket.data.email = email;
        socket.data.name = name;
        io.sockets.emit('userLogin', email);
    });

    socket.on('getActiveUsers', async (callback) => {
        console.log('getActiveUsers');
        const clients = await io.fetchSockets();
        const info = [];
        for (let i = 0; i < clients.length; i += 1) {
            const array = [
                {
                    Field: 'email',
                    Value: clients[i].data.email,
                },
                {
                    Field: 'name',
                    Value: clients[i].data.name,
                },
            ];
            const obj = array.reduce((acc, { Field, Value }) => ({ ...acc, [Field]: Value }), {});
            info.push(obj);
        }
        console.log(JSON.stringify(info));
        callback({
            users: JSON.stringify(info),
        });
    });
});

server.listen(PORT, () => {
    console.log(`Running at port *:${PORT}`);
});
