'use strict';

const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const wsURL = `${protocol}://${window.location.host}/ws`;

function getSocketConnection() {
    const socket = new WebSocket(wsURL);

    socket.onopen = (event) => {
        console.log('Opened websocket connection to server.');
    }

    socket.onmessage = (event) => {
        console.log('Client Received: %s', event.data);
    }

    socket.onclose = (event) => {
        console.log('Websocket connection closed.');
    }

    return socket;
}

export {getSocketConnection};