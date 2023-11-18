'use strict';
const {MongoClient} = require("mongodb");
const config = require("../../dbConfig.json");

class Database {
    #databaseURL = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
    #databaseName = config.dbName;
    #client;

    constructor() {
        this.#client = new MongoClient(this.#databaseURL);
    }

    async connect() {
        await this.#client.connect();
    }

    async disconnect() {
        if (this.#client.isConnected()) {
            await this.#client.close();
        }
    }

    async reconnect() {
        await this.disconnect();
        await this.connect();
    }

    async queryDBCollection(collectionName, lambda) {
        const collection = this.#client.db(this.#databaseName).collection(collectionName);
        return await lambda(collection);
    }
}

module.exports = {Database};