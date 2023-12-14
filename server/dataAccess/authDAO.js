// Auth Data Access

const {ValueAlreadyTakenError, BadRequestError} = require("./dataAccessErrors");
const {AuthToken} = require("../models");
const dbConfig = require('../config.json').database;

class AuthDAO {
    #collection;

    constructor(mongoDatabase) {
        this.#collection = mongoDatabase.collection(dbConfig.authCollectionName);
    }

    /**
     * Registers the given token string as a valid token for the given user.
     *
     * @param tokenString the token string to register
     * @param username the username to associate with the token
     */
    async addToken(tokenString, username) {
        const authToken = new AuthToken(tokenString, username);
        const matchingTokens = await this.#collection.find(authToken).toArray();
        if (matchingTokens.length === 0) {
            await this.#collection.insertOne(authToken);
        } else {
            throw new ValueAlreadyTakenError("Failed to insert new token, token is already registered");
        }
    }

    /**
     * Checks if the given token string is currently valid.
     *
     * @param tokenString the token to validate
     * @return true iff the given token is currently valid
     */
    async isValidToken(tokenString) {
        const query = {tokenString: tokenString};
        const cursor = await this.#collection.find(query);
        const results = await cursor.toArray();
        return results.length > 0;
    }

    /**
     * Returns the username associated with the given token string.
     *
     * @param tokenString the token to validate
     * @return true iff the given token is currently valid
     */
    async getUsernameFromTokenString(tokenString) {
        const query = {tokenString: tokenString};
        const cursor = await this.#collection.find(query);
        const results = await cursor.toArray();
        if (results.length === 0) {
            throw new BadRequestError("Failed to find user, provided token is invalid");
        }
        return results[0].username;
    }

    /**
     * Invalidates the given token string. Future calls requiring authorization for the given user will need to
     * generate a new token by re-authenticating.
     *
     * @param tokenString the token to invalidate
     */
    async removeToken(tokenString) {
        const query = {tokenString: tokenString};
        await this.#collection.deleteMany(query);
    }

    /**
     * Invalidates every currently valid token. Future calls requiring authorization will need to generate
     * new tokens by re-authenticating.
     */
    async clearTokens() {
        await this.#collection.deleteMany({});
    }
}

module.exports = {AuthDAO};