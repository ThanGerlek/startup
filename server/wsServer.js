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
        try {
            handleClientMessage(message, connection);
        } catch (e) {
            if (e instanceof UserFriendlyError) {
                const response = {action: 'error', 'value': e.getUserMessage()};
                connection.ws.send(JSON.stringify(response));
            }
            throw e;
        }
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

function handleClientMessage(message, connection) {
    if (message.action === 'registerUsername') {
        registerUsernameWithConnection(message.value, connection);
    } else if (message.action === 'submitMove') {
        submitMove(message.value, connection);
    } else if (message.action === 'test') {
        console.log("Received test message: %s", JSON.stringify(message));
    } else {
        throw new BadRequestError(`Invalid WebSocket message (unrecognized action ${message.action}): ${JSON.stringify(message)}`);
    }
}

function registerUsernameWithConnection(username, connection) {
    if (!!connection.username && connection.username !== username) {
        throw new Error(`Tried to register connection username '${username}', but that connection already has username '${connection.username}'`);
    }
    connection.username = username;
}

function submitMove(gameData, connection) {
    console.log(`Received submitMove() request with gameData ${gameData}`);
    const conn = getConnectionFromUsername(gameData.opponentUsername);
    if (!!conn) {
        const opponentGameData = getOpponentGameData(gameData);
        const message = {action: 'loadGame', value: opponentGameData};
        conn.ws.send(JSON.stringify(message));
    } else {

    }
}

function getConnectionFromUsername(username) {
    const index = connections.findIndex((conn, index) => conn.username === username);
    if (index <= 0) {
        throw new UserFriendlyError(`Could not find connection for username '${username}'`, "Sorry, we couldn't find that person. The username you entered might be incorrect, or maybe they're not online right now.");
    }
    return connections[index];
}

function getOpponentGameData(gameData) {
    const opponentGameData = JSON.parse(JSON.stringify(gameData));
    opponentGameData.isPlayerTurn = !gameData.isPlayerTurn;
    opponentGameData.playerUsername = gameData.opponentUsername;
    opponentGameData.opponentUsername = gameData.playerUsername;
    return opponentGameData;
}

class UserFriendlyError extends Error {
    #userMessage;

    constructor(errorMessage, userMessage) {
        super(errorMessage);
        this.#userMessage = userMessage;
    }

    getUserMessage() {
        return this.#userMessage;
    }
}

module.exports = {handleUpgrade};