import http from 'http';
import net from 'net';
import webSocket from 'websocket';
import fs from 'fs';

const hostname = 'localhost';
const port = 3000;
const port_socket = 9898;

const dirName = `https://${hostname}:${port}/`;

//http protocol

// const server = http.createServer((req, res) => {
//   // if (req.url === '/') {
//   //   res.writeHead(200, { 'Content-Type': 'text/html' });
//   //   fs.createReadStream('client.html').pipe(res);
//   // }
//   res.statusCode = 200;
//   res.end('Hello, World!\n');
// });
//
// server.listen(port, hostname, () => {
//   console.log(`Server running at https://${hostname}:${port}/`);
// });

//tcp protocol - socket

const socketServer = net.createServer((socket) => {
    // socket.on('data', (data) => {
    //   console.log(data.toString());
    // });
    socket.write('SERVER: Hello! This is server speaking.');
    socket.end('SERVER: Closing connection now.');
});

socketServer.on('error', (err) => {
    console.error('my error' + err);
});

socketServer.listen(port, () => {
    console.log('opened server on', socketServer.address().port);
});

// const WebSocketServer = webSocket.server;
// const server = http.createServer((req, res) => {
//   //   res.statusCode = 200;
//   //   res.setHeader('Content-Type', 'text/plain');
//   //   res.end('Hello, World!\n');
// });
// server.listen(port_socket);
//
// const wsServer = new WebSocketServer({
//   httpServer: server,
//   on : function (request) {
//     const connection = request.accept(null, request.origin);
//
//     connection.on('message', function (message) {
//       console.log('Received Message:', message.utf8Data);
//       connection.sendUTF('Hi this is WebSocket server!');
//     });
//     connection.on('close', function (reasonCode, description) {
//       console.log('Client has disconnected.');
//     });
//   }
// });
