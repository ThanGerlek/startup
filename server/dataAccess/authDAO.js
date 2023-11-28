'use strict';

// Auth Data Access

const {ValueAlreadyTakenError} = require("./dataAccessErrors");
const dbConfig = require('../../dbConfig.json');

class AuthDAO {
    #collection;

    constructor(mongoDatabase) {
        this.#collection = mongoDatabase.collection(dbConfig.authCollectionName);
    }

    /**
     * Registers the given token as a valid token.
     *
     * @param token the AuthToken to register
     */
    async addToken(token) {
        const jsonToken = {tokenString: token};

        const matchingTokens = await this.#collection.find(jsonToken).toArray();
        if (matchingTokens.length === 0) {
            console.log(`addToken(${token}): inserting now`);
            await this.#collection.insertOne(jsonToken);
        } else {
            throw new ValueAlreadyTakenError("Failed to insert new token, token is already registered");
        }
    }

    /**
     * Checks if the given token is currently valid.
     *
     * @param token the token to validate
     * @return true iff the given token is currently valid
     */
    async isValidToken(token) {
        const query = {tokenString: token};
        const options = {limit: 1};
        const cursor = await this.#collection.find(query, options);
        const results = await cursor.toArray();
        console.log(`isValidToken(${token}): results = '${results}'`);
        return results.length > 0;
    }

    /**
     * Invalidates the given token. Future calls requiring authorization for the given user will need to
     * generate a new token by re-authenticating.
     *
     * @param token the token to invalidate
     */
    async removeToken(token) {
        const query = {tokenString: token};
        await this.#collection.deleteMany(query);
    }

    /**
     * Invalidates every currently valid token. Future calls requiring authorization will need to generate
     * new tokens by re-authenticating.
     */
    async clearTokens() {
        const query = {};
        await this.#collection.deleteMany(query);
    }
}

module.exports = {AuthDAO};