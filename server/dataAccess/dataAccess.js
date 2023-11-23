'use strict';

const {AuthDAO} = require('./authDAO');
const {GameDAO} = require('./gameDAO');
const {GameRequestDAO} = require('./gameRequestDAO');
const {UserDAO} = require('./userDAO');
const {
    DataAccessError, BadRequestError, NoSuchItemError, UnauthorizedAccessError, ValueAlreadyTakenError
} = require('./dataAccessErrors');


class DataAccessManager {
    #authDAO;
    #gameDAO;
    #gameRequestDAO;
    #userDAO;

    getAuthDAO() {
        if (!this.#authDAO) {
            this.#authDAO = new AuthDAO();
        }
        return this.#authDAO;
    }

    getGameDAO() {
        if (!this.#gameDAO) {
            this.#gameDAO = new GameDAO(this.getUserDAO());
        }
        return this.#authDAO;
    }

    getGameRequestDAO() {
        if (!this.#gameRequestDAO) {
            this.#gameRequestDAO = new GameRequestDAO(this.getUserDAO());
        }
        return this.#gameRequestDAO;
    }

    getUserDAO() {
        if (!this.#userDAO) {
            this.#userDAO = new UserDAO();
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