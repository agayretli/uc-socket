/* eslint-disable no-undef */

import { doesNotMatch } from 'assert';
import Jest from 'jest';

const { createServer } = require('http');
const { Server } = require('socket.io');
const Client = require('socket.io-client');

jest.setTimeout(30000);

describe('basic socket.io example', () => {
    let io: any;
    let serverSocket: any;
    let clientSocket: any; // usage of any here probably not a good use of typescript

    // see example on socket.io testing documentation page
    beforeAll((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const PORT: number = 5000 || Number(process.env.PORT);
            clientSocket = new Client(`http://localhost:${PORT}`);
            io.on('connection', (socket: any) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
    });

    afterAll(() => {
        io.close();
        clientSocket.close();
    });

    test('connected must be true', async () => {
        const start = Date.now();
        const result = await clientSocket.emit('ping', () => {
            console.log(`pong (latency: ${Date.now() - start} ms)`);
        });
        expect(result.connected).toBe(true);
    });
});
