import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {Module} from 'node:module';

export const require = Module.createRequire(import.meta.url); // instead use require() of commonJs
export const __filename = fileURLToPath(import.meta.url); // instead __filename & __dirname of commonJs
export const __dirname = dirname(__filename);

import http from "http";
import {Server} from 'socket.io';

const express = require('express');
const cors = require("cors");

const socketPort = 8000;
const port = 8002;
const host = 'localhost';

////////////web socket service

const socketApp = express();
const socketServer = http.createServer(socketApp);
const io = new Server(socketServer, {cors: {origin: '*'}});

io.on('connection', (socket) => {
    console.log('socket connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('message', (data) => {
        console.log('chat message received! ' + data.toString());
    });

    setInterval(() => {
        socket.emit('stock', [
            {label: "ABC", price: getPrice()},
            {label: "DEF", price: getPrice()},
            {label: "GHI", price: getPrice()},
            {label: "JKL", price: getPrice()}])
    }, 5000)
});

socketServer.listen(socketPort, () => {
    console.log(`socket triggering on *:${socketPort}`);
});

//////////server

const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: ['http://localhost:8001'],
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
    //res.sendFile(__dirname + '/client.html');
});

app.use('/users', require('./userApi.cjs'))

server.listen(port, () => {
    console.log(`server listening on *:${port}`);
});

function getPrice() {
    return Math.floor(Math.random() * 10000) + 1
}