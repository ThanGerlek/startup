'use strict';

const {MongoClient} = require("mongodb");
const config = require("../config.json");
const {DataAccessManager} = require("./dataAccess/dataAccess");

const mongoURL = `mongodb+srv://${config.database.username}:${config.database.password}@${config.database.hostname}`;

// TODO How to close connection?
//  Currently it seems to close automatically, and throw an "accessed a closed connection" error
//  if I try to close it manually.

async function connectAndRun(callback) {
    const client = new MongoClient(mongoURL);
    await client.connect();
    // try {
    const db = client.db(config.database.dbName);
    const dataAccessManager = new DataAccessManager(db);
    return callback(dataAccessManager);
    // } finally {
    // await client.close();
    // }
}

module.exports = {connectAndRun};