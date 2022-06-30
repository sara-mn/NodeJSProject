import socket from "./socketService.js";

// import $ from 'jquery';
// import 'bootstrap';
// window.$ = $;
// Start off with the login modal open
jQuery('#login-modal').modal();
jQuery('#login-modal input').focus();

// $('#login-modal').on('shown.bs.modal', function () {
//     $('#login-modal input').trigger('focus')
// })
let msgContainer = document.querySelector('.message-container');
let roomSelectContainer = document.querySelector('#room-list');

export function closeLoginModal() {
    jQuery('#login-modal').modal('hide')
}

export function showLoadingSpinner() {
    jQuery('#login-form').hide();
    jQuery('#login-spinner').show();
}

export function writeMessageToPage(msg) {
    console.log('i am here writeMessageToPage')
    let containerEl = document.createElement('div');
    containerEl.classList.add('row');

    let authorEl = document.createElement('div');
    authorEl.classList.add('col-xs-3');
    authorEl.classList.add('author-name');
    authorEl.innerText = msg.user.username + ':';

    let msgEl = document.createElement('div');
    msgEl.classList.add('col-xs-9');
    msgEl.innerText = msg.message;

    containerEl.appendChild(authorEl);
    containerEl.appendChild(msgEl);
    msgContainer.appendChild(containerEl);
    msgContainer.scrollTop = msgContainer.scrollHeight;
}

export function clearMessages() {
    msgContainer.innerHTML = '';
}

export function sanitizeRoomName(name) {
    return name
        .replace(/\s\d+$/, '')
        .replace(/\s/g, '-')
        .toLowerCase();
}

export function renderRoomButtons(roomList) {
    roomSelectContainer.innerHTML = '';
    roomList.forEach((room, idx) => {
        let row = document.createElement('div');
        row.classList.add('row');
        let btn = document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add('room-btn');
        btn.classList.add(sanitizeRoomName(room.name));
        if (idx) {
            btn.classList.add('btn-default');
        } else {
            btn.classList.add('btn-primary');
        }
        btn.innerText = room.name + ' ';

        let unread = document.createElement('span');
        unread.classList.add('label');
        unread.classList.add('label-success');
        unread.classList.add('unread');
        unread.innerText = '0';
        unread.style.display = 'none';
        btn.appendChild(unread);

        row.appendChild(btn);
        roomSelectContainer.appendChild(row);
    });
}

export function setActiveRoom(roomName) {
    clearMessages();
    console.log('i am here setActiveRoom')

    let activeRoom = document.querySelector('.room-btn.btn-primary');
    activeRoom.classList.remove('btn-primary');
    activeRoom.classList.add('btn-default');

    let newActiveRoom = document.querySelector('.' + sanitizeRoomName(roomName));
    newActiveRoom.classList.add('btn-primary');
    newActiveRoom.classList.remove('btn-default');

    setUnread({
        roomName,
        number: 0
    });
}

export function setUnread(arg) {
    let roomBtn = document.querySelector('.' + sanitizeRoomName(arg.roomName));
    if (!roomBtn) {
        return;
    }
    let unreadEl = roomBtn.querySelector('.unread');
    if (arg.number === 0) {
        unreadEl.style.display = 'none';
    } else {
        unreadEl.innerText = arg.number;
        unreadEl.style.display = 'inline';
    }
}