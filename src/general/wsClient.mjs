'use strict';

import {displayMessage} from "./message-display.js";

const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const wsURL = `${protocol}://${window.location.host}/ws`;


const defaultLoadGameCallback = () => {
    throw new Error("loadGameCallback() was called but not set");
};

let loadGameCallback = defaultLoadGameCallback;

function setLoadGameCallback(callback) {
    loadGameCallback = callback;
}

function getSocketConnection() {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket(wsURL);

        socket.onopen = (event) => {
            resolve(socket);
            console.log('Opened websocket connection to server.');
        }

        socket.onmessage = (event) => {
            const message = getMessageFromEventData(event.data);
            handleServerMessage(message);
        }

        socket.onclose = (event) => {
            console.log('Websocket connection closed.');
        }

        setTimeout(() => {
            if (socket.CONNECTING) {
                reject("Timed out while still in CONNECTING state");
            }
        }, 5000);
    });
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
    } else if (message.action === 'notify') {
        displayMessage('info', message.value);
    } else if (message.action === 'warn') {
        displayMessage('warn', message.value);
    } else if (message.action === 'error') {
        displayMessage('error', message.value);
    } else if (message.action === 'log') {
        console.log(`[Server] ${message.value}`);
    } else if (message.action === 'test') {
        console.log("Received test message: %s", JSON.stringify(message));
    } else {
        throw new Error(`Invalid WebSocket message (unrecognized action ${message.action}): ${JSON.stringify(message)}`);
    }
}

function loadGame(gameData) {
    console.log(`Received loadGame() request with gameData ${JSON.stringify(gameData)}`);
    loadGameCallback(gameData);
}

export {getSocketConnection, setLoadGameCallback};