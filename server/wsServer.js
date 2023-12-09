'use strict';

const {WebSocketServer} = require('ws');
const {BadRequestError} = require("./dataAccess/dataAccess");

const wss = new WebSocketServer({noServer: true});

const connections = [];
let nextFreeId = 0;

const games = [];

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
    } else if (message.action === 'createGame') {
        createGame(message.value, connection);
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
    connection.ws.send(JSON.stringify({action: 'log', value: 'Registered username.'}))
}

function submitMove(gameData, connection) {
    console.log(`Received submitMove() request with gameData ${gameData}`);
    const senderUsername = connection.username;
    if (!senderUsername) {
        throw new Error("Tried to submitMove() from a connection with no registered username");
    }

    let otherUsername;
    if (gameData.players[0] === senderUsername) {
        otherUsername = gameData.players[1];
    } else if (gameData.players[1] === senderUsername) {
        otherUsername = gameData.players[0];
    } else {
        throw new Error("Tried to submitMove() with gameData that does not include the sender as a player");
    }

    const otherConnection = getConnectionFromUsername(otherUsername);

    if (!!otherConnection) {
        otherConnection.ws.send(JSON.stringify({action: 'loadGame', value: gameData}));
        connection.ws.send(JSON.stringify({action: 'log', value: 'Move submitted to the other player.'}));
    } else {
        const response = {action: 'warn', value: "Couldn't reach the other player; they may have disconnected."};
        connection.ws.send(JSON.stringify(response));
    }
}

function getConnectionFromUsername(username) {
    const index = connections.findIndex((conn, index) => conn.username === username);
    if (index <= 0) {
        return null;
    }
    return connections[index];
}

function createGame(gameData, connection) {
    const existingGame = findGame(gameData.players[0], gameData.players[1]);
    const opponentConnection = getOtherConnectionFromUsername(gameData, connection.username);
    if (!!existingGame) {
        connection.ws.send(JSON.stringify({action: 'loadGame', value: existingGame}));

        if (!!opponentConnection) {
            const msg = `${connection.username} has joined the game. Prepare for battle!`;
            opponentConnection.ws.send(JSON.stringify({action: 'notify', value: msg}));
        } else {
            const msg = `${connection.username} hasn't joined the game yet.`;
            connection.ws.send(JSON.stringify({action: 'notify', value: msg}));
        }
    } else {
        games.push(gameData);
        connection.ws.send(JSON.stringify({action: 'log', value: 'Created new game successfully'}));

        if (!!opponentConnection) {
            const msg = `${connection.username} has begun a new game. Prepare for battle!`;
            opponentConnection.ws.send(JSON.stringify({action: 'notify', value: msg}));
        } else {
            const msg = `${connection.username} hasn't joined the game yet.`;
            connection.ws.send(JSON.stringify({action: 'notify', value: msg}));
        }
    }
}

function getOtherConnectionFromUsername(gameData, username) {
    const otherUsername = (gameData.players[0] === username) ? gameData.players[1] : gameData.players[0];
    return getConnectionFromUsername(otherUsername);
}

function findGame(player1, player2) {
    const predicate = game => game.players.includes(player1) && game.players.includes(player2);
    const index = games.findIndex((game, index) => predicate(game));
    return (index < 0) ? null : games[index];
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