'use strict';

const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const wsURL = `${protocol}://${window.location.host}/ws`;

function getSocketConnection() {
    const socket = new WebSocket(wsURL);

    socket.onopen = (event) => {
        console.log('Opened websocket connection to server.');
    }

    socket.onmessage = (event) => {
        const message = getMessageFromEventData(event.data);
        handleServerMessage(message);
    }

    socket.onclose = (event) => {
        console.log('Websocket connection closed.');
    }

    return socket;
}

function getMessageFromEventData(dataString) {
    const message = JSON.parse(dataString);
    if (!message.action) {
        throw new Error(`Invalid WebSocket message (could not find .action property): ${dataString}`);
    }
    return message;
}

function handleServerMessage(message) {
    if (message.action === 'loadGame') {
        loadGame(message.value);
    } else if (message.action === 'test') {
        console.log("Received test message: %s", JSON.stringify(message));
    } else {
        throw new Error(`Invalid WebSocket message (unrecognized action ${message.action}): ${JSON.stringify(message)}`);
    }
}

function loadGame(gameData) {
    console.log(`Received loadGame() request with gameData ${gameData}`);
    // TODO
}

export {getSocketConnection};