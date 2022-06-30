import {fromEvent, merge, ReplaySubject, Subject, AsyncSubject, Observable} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {webSocket} from 'rxjs/webSocket';
import {map, filter, tap, switchMap, withLatestFrom, scan} from 'rxjs/operators';
import {
    showLoadingSpinner,
    closeLoginModal,
    renderRoomButtons,
    setActiveRoom,
    writeMessageToPage,
    setUnread
} from './chatlib.js';
import socket from "./socketService.js";

// Login modal
let loginBtn = document.querySelector('#login-button');
let loginInput = document.querySelector('#login-input');

// Sending a message
let msgBox = document.querySelector('#msg-box');
let sendBtn = document.querySelector('#send-button');

let roomList = document.querySelector('#room-list');

let chatStream$ = new Subject();
chatStream$.subscribe((data) => socket.emit('message' , data))
// {
//     next: (val) => {
//         console.log('i am here 4');
//         console.log(val);
//         socket.emit('message' , val);
//     }
// }
//     new Observable((observer) => {
//     socket.emit
//     socket.on('message') , (data) => {
//         console.log(data);
//         observer.next(data);
//     }
//     return () => socket.disconnect();
// });

let userSubject$ = new AsyncSubject();

function authenticateUser(username) {
    let user$ = ajax(
        'http://localhost:8002/users/'
        + username)
        .pipe(
            map(data => data.response)
        );

    user$.subscribe(userSubject$);
}

merge(
    fromEvent(loginBtn, 'click'),
    fromEvent(loginInput, 'keypress')
        .pipe(
            // Ignore all keys except for enter
            filter(e => e.keyCode === 13)
        )
)
    .pipe(
        map(() => loginInput.value),
        filter(Boolean),
        tap(showLoadingSpinner)
    )
    .subscribe(authenticateUser);

userSubject$
    .subscribe(closeLoginModal);

// ===== Rooms =====
function makeRoomStream(roomName) {
    let roomStream$ = new ReplaySubject(100);
    chatStream$
        .pipe(
            filter(msg => msg.room === roomName),
            tap((e) => roomStream$.next(e)),
            tap((e) => {
                console.log('chatStream');
                console.log(roomName);
                console.log(e);
            }),
        )
        .subscribe(roomStream$.next())
    return roomStream$;
}

let roomStreams = {};
userSubject$
    .subscribe(userObj => {
        userObj.rooms.forEach(room =>
            roomStreams[room.name] = makeRoomStream(room.name)
        );
        console.log('roomStreams');
        console.log(roomStreams);
    });
userSubject$
    .subscribe(userObj => renderRoomButtons(userObj.rooms));
userSubject$
    .subscribe(userObj => roomLoads$.next(userObj.rooms[0].name));

let roomClicks$ = fromEvent(roomList, 'click')
    .pipe(
        // If they click on the number, pass on the button
        map(event => {
            if (event.target.tagName === 'SPAN') {
                return event.target.parentNode;
            }
            return event.target;
        }),
        // Remove unread number from room name text
        map(element => element.innerText.replace(/\s\d+$/, ''))
    );

let roomLoads$ = new Subject();
roomClicks$.subscribe(roomLoads$);

roomLoads$
    .pipe(
        tap((val) => {setActiveRoom(val);
            console.log('i am here 2');console.log(val)}),
        switchMap(room => roomStreams[room])
    )
    .subscribe();


// ===== Sending Messages =====
merge(
    fromEvent(sendBtn, 'click'),
    fromEvent(msgBox, 'keypress').pipe(
            // Only emit event when enter key is pressed
            filter(e => e.keyCode === 13)
        )
).pipe(
        map(() => msgBox.value),
        filter(Boolean),
        tap(() => {msgBox.value = '';console.log('i am here 1')}),
        withLatestFrom(
            roomLoads$,
            userSubject$,
            (message, room, user) => ({message, room, user})
        )
    )
    .subscribe(val => {
        chatStream$.next(val);
        console.log('i am here 3');console.log(val);
        writeMessageToPage(val)
    });

// ===== Unread =====
merge(
    chatStream$.pipe(
        tap(console.log),
        map(msg => ({type: 'message', room: msg.room}))
    ),
    roomLoads$.pipe(
        map(room => ({type: 'roomLoad', room: room}))
    )
)
    .pipe(
        scan((unread, event) => {
            // new message in room
            console.log(event);
            console.log(unread);
            if (event.type === 'roomLoad') {
                unread.activeRoom = event.room;
                unread.rooms[event.room] = 0;
            } else if (event.type === 'message') {
                if (event.room === unread.activeRoom) {
                    return unread;
                }
                if (!unread.rooms[event.room]) {
                    unread.rooms[event.room] = 0;
                }
                unread.rooms[event.room]++;
            }
            return unread;
        }, {
            rooms: {},
            activeRoom: ''
        }),
        map(unread => unread.rooms),
        map(rooms =>
            Object.keys(rooms)
                .map(key => ({
                    roomName: key,
                    number: rooms[key]
                }))
        )
    )
    .subscribe(roomArr => {
        roomArr.forEach(setUnread);
    });
