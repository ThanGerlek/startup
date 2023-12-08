'use strict';

const {WebSocketServer} = require('ws');

const wss = new WebSocketServer({noServer: true});

const connections = [];
let nextFreeId = 0;

wss.on('connection', (ws) => {
    const connection = {id: nextFreeId++, alive: true, ws: ws};
    console.log("Establishing new connection with id: %d", connection.id);
    connections.push(connection);

    ws.on('message', (data) => {
        const msg = String.fromCharCode(...data);
        console.log('Server received: %s', msg);
        ws.send('Server heard the client say "' + msg + '"');
    });

    ws.on('close', () => {
        connections.findIndex((conn, index) => {
            if (conn.id === connection.id) {
                connections.splice(index, 1);
                return true;
            }
        });
    });

    ws.on('pong', () => {
        connection.alive = true;
    });

    ws.send('Hello, client!');
});

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
}

module.exports = {handleUpgrade};