import {io} from 'socket.io-client';

const socket = io('ws://localhost:8000', {
    // autoConnect: true
});  //instead => new WebSocket('ws://localhost:8000'); of js

socket.connect();
export default socket;