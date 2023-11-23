'use strict';

// Auth Data Access
// TODO db

const {ValueAlreadyTakenError} = require("./dataAccessErrors");
const colName = 'auth';

class AuthDAO {
    #database;

    constructor(database) {
        this.#database = database;
    }

    /**
     * Registers the given token as a valid token.
     *
     * @param token the AuthToken to register
     */
    async addToken(token) {
        const jsonToken = {tokenString: token};

        await this.#database.queryDBCollection(colName, async col => {
            const matchingTokens = await col.find(jsonToken).toArray();
            if (matchingTokens.length === 0) {
                console.log(`addToken(${token}): inserting now`);
                col.insertOne(jsonToken);
            } else {
                throw new ValueAlreadyTakenError("Failed to insert new token, token is already registered");
            }
        });
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
        return await this.#database.queryDBCollection(colName, async col => {
            const cursor = col.find(query, options);
            const results = await cursor.toArray();
            console.log(`isValidToken(${token}): results = '${results}'`);
            return results.length > 0;
        });
    }

    /**
     * Invalidates the given token. Future calls requiring authorization for the given user will need to
     * generate a new token by re-authenticating.
     *
     * @param token the token to invalidate
     */
    async removeToken(token) {
        const query = {tokenString: token};
        await this.#database.queryDBCollection(colName, col => col.deleteMany(query));
    }

    /**
     * Invalidates every currently valid token. Future calls requiring authorization will need to generate
     * new tokens by re-authenticating.
     */
    async clearTokens() {
        const query = {};
        await this.#database.queryDBCollection(colName, col => col.deleteMany(query));
    }
}

module.exports = {AuthDAO};