'use strict'

const app = require('./server');
const {handleUpgrade} = require('./wsServer');

const port = 4000;

const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

server.on('upgrade', handleUpgrade);