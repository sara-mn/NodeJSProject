import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Module } from 'node:module';

export const require = Module.createRequire(import.meta.url); // instead use require() of commonJs
export const __filename = fileURLToPath(import.meta.url); // instead __filename & __dirname of commonJs
export const __dirname = dirname(__filename);

import http from "http";
import {Server} from 'socket.io';

const express = require('express');
const cors = require("cors");

const port = 8000;
const host = 'localhost';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors({
    origin: ['http://localhost:8001'],
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
    //res.sendFile(__dirname + '/client.html');
});

io.on('connection', (socket) => {
    console.log('socket connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    socket.on('chat message', (data) => {
        console.log('chat message received! ' + data.toString());
    });
    setInterval(() => {
        socket.emit('stock' , [
            {label: "ABC" , price: getPrice() },
            {label: "DEF" , price: getPrice() },
            {label: "GHI" , price: getPrice() },
            {label: "JKL" , price: getPrice() }])
    },5000)
});

server.listen(port, () => {
    console.log(`listening on *:${port}`);
});

function getPrice(){
   return Math.floor(Math.random() * 10000) + 1
}