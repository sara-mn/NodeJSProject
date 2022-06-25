import socket from "./socketService.js";
import './rxjs-sample.js';

socket.on('stock', (data) => {
    console.log(data.stock);
})

const form = document.querySelector("#form");
const input = document.getElementById('input');

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

// socket.addEventListener('open', function (event) {
//     socket.send('Hello Server!');
// });
//
// // Listen for messages
// socket.addEventListener('message', function (event) {
//     console.log('Message from server ', event.data);
// });
//
// socket.send("Here's some text that the server is urgently awaiting!");
//
// socket.onopen = function (event) { //when a connection is established, send data
//     socket.send("Here's some text that the server is urgently awaiting!");
// };
//
// socket.onmessage = function (event) { // receiving data from server
//     console.log(event.data);
// }
//
// socket.close(); // closing the connection

// // Connect to a server @ port 3000
// const client = net.createConnection({ port: 3000 }, () => {
//     console.log('CLIENT: I connected to the server.');
//     client.write(`CLIENT: Hello this is client! ${}`);
// });
//
// client.on('data', (data) => {
//     console.log(data.toString());
//     client.end();
// });
//
// client.on('end', () => {
//     console.log('CLIENT: I disconnected from the server.');
// });