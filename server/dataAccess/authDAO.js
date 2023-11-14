'use strict';

// Auth Data Access
// TODO test

const {ValueAlreadyTakenError} = require("./dataAccessErrors");

class AuthDAO {

    #tokenList;

    constructor() {
        this.#tokenList = [];
    }

    /**
     * Registers the given token as a valid token.
     *
     * @param token the AuthToken to register
     */
    addToken(token) {
        if (this.isValidToken(token)) {
            throw new ValueAlreadyTakenError("Failed to insert new token, token is already registered");
        }
        this.#tokenList.push(token);
    }

    /**
     * Checks if the given token is currently valid.
     *
     * @param token the token to validate
     * @return true iff the given token is currently valid
     */
    isValidToken(token) {
        return this.#tokenList.includes(token);
    }

    /**
     * Invalidates the given token. Future calls requiring authorization for the given user will need to
     * generate a new token by re-authenticating.
     *
     * @param token the token to invalidate
     */
    removeToken(token) {
        let index = this.#tokenList.indexOf(token);
        if (index >= 0) {
            this.#tokenList.splice(index, 1);
        }
    }

    /**
     * Invalidates every currently valid token. Future calls requiring authorization will need to generate
     * new tokens by re-authenticating.
     */
    clearTokens() {
        this.#tokenList = [];
    }
}

module.exports = {AuthDAO};