'use strict';

const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

socket.onopen = (event) => {
    console.log('Opened websocket connection to server.');
}

socket.onmessage = (event) => {
    console.log('Client Received: %s', event.data);
}

socket.onclose = (event) => {
    console.log('Websocket connection closed.');
}

export {socket};