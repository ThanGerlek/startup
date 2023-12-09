'use strict';

const {WebSocketServer} = require('ws');
const {BadRequestError} = require("./dataAccess/dataAccess");

const wss = new WebSocketServer({noServer: true});

const connections = [];
let nextFreeId = 0;

wss.on('connection', (ws) => {
    const connection = {id: nextFreeId++, alive: true, ws: ws};
    console.log("Establishing new connection with id: %d", connection.id);
    connections.push(connection);

    ws.on('message', (rawData) => {
        const message = getMessageFromRaw(rawData);
        handleClientMessage(message, connection.id);
    });

    ws.on('close', () => {
        const index = getIndexFromID(connection.id);
        connections.splice(index, 1);
    });

    ws.on('pong', () => {
        connection.alive = true;
    });
});

function getIndexFromID(connectionID) {
    return connections.findIndex((conn, index) => (conn.id === connectionID));
}

setInterval(() => {
    connections.forEach((conn) => {
        if (conn.alive) {
            conn.alive = false;
            conn.ws.ping();
        } else {
            conn.ws.terminate();
        }
    });
}, 10000);

const handleUpgrade = (req, socket, head) => {
    wss.handleUpgrade(req, socket, head, function done(ws) {
        wss.emit('connection', ws, req);
    });
};

function getMessageFromRaw(rawData) {
    const dataString = String.fromCharCode(...rawData);
    console.log('Server received: %s', dataString);
    let message;
    try {
        message = JSON.parse(dataString);
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new BadRequestError("Failed to parse WebSocket message from string: " + dataString);
        } else {
            throw e;
        }
    }
    if (!message.action) {
        throw new BadRequestError("Invalid WebSocket message (could not find .action property): " + dataString);
    }
    return message;
}

function handleClientMessage(message, connectionID) {
    if (message.action === 'setUsername') {
        registerUsernameWithConnection(message.value, connectionID);
    } else if (message.action === 'submitMove') {
        submitMove(message.value);
    } else if (message.action === 'test') {
        console.log("Received test message: %s", JSON.stringify(message));
    } else {
        throw new BadRequestError(`Invalid WebSocket message (unrecognized action ${message.action}): ${JSON.stringify(message)}`);
    }
}

function registerUsernameWithConnection(username, connectionID) {
    const conn = connections[getIndexFromID(connectionID)];
    if (!!conn.username && conn.username !== username) {
        throw new Error(`Tried to register connection username '${username}', but that ID already has username '${conn.username}'`);
    }
    conn.username = username;
}

function submitMove(gameData) {
    console.log(`Received submitMove() request with gameData ${gameData}`);
    // TODO
}

function getConnectionFromUsername(username) {
    const index = connections.findIndex((conn, index) => conn.username === username);
    if (index <= 0) {
        throw new Error(`Could not find connection for username '${username}'`);
    }
    return connections[index];
}

module.exports = {handleUpgrade};