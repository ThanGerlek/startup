'use strict';

const {AuthDAO} = require('./authDAO');
const {GameDAO} = require('./gameDAO');
const {GameRequestDAO} = require('./gameRequestDAO');
const {UserDAO} = require('./userDAO');
const {
    DataAccessError, BadRequestError, NoSuchItemError, UnauthorizedAccessError, ValueAlreadyTakenError
} = require('./dataAccessErrors');
const {MongoClient} = require("mongodb");
const config = require("../../dbConfig.json");


class DataAccessManager {
    #mongoDatabase;
    #authDAO;
    #gameDAO;
    #gameRequestDAO;
    #userDAO;

    constructor(mongoDatabase) {
        if (!mongoDatabase) {
            const client = new MongoClient(`mongodb+srv://${config.username}:${config.password}@${config.hostname}`);
            this.#mongoDatabase = client.db(config.dbName);
        } else {
            this.#mongoDatabase = mongoDatabase;
        }
    }

    getAuthDAO() {
        if (!this.#authDAO) {
            this.#authDAO = new AuthDAO(this.#mongoDatabase);
        }
        return this.#authDAO;
    }

    getGameDAO() {
        if (!this.#gameDAO) {
            this.#gameDAO = new GameDAO(this.#mongoDatabase, this.getUserDAO());
        }
        return this.#authDAO;
    }

    getGameRequestDAO() {
        if (!this.#gameRequestDAO) {
            this.#gameRequestDAO = new GameRequestDAO(this.#mongoDatabase, this.getUserDAO());
        }
        return this.#gameRequestDAO;
    }

    getUserDAO() {
        if (!this.#userDAO) {
            this.#userDAO = new UserDAO(this.#mongoDatabase);
        }
        return this.#userDAO;
    }
}

module.exports = {
    DataAccessManager,
    DataAccessError,
    BadRequestError,
    NoSuchItemError,
    ValueAlreadyTakenError,
    UnauthorizedAccessError,
};