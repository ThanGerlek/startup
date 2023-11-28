'use strict';

// User Data Access

const {NoSuchItemError, ValueAlreadyTakenError} = require("./dataAccessErrors");
const dbConfig = require("../../dbConfig.json");

class UserDAO {
    #collection;

    constructor(mongoDatabase) {
        this.#collection = mongoDatabase.collection(dbConfig.userCollectionName);
    }

    /**
     * Adds a new User to the database.
     *
     * @param user the User to insert
     */
    async insertNewUser(user) {
        /* Failures
        can't access database
        username already exists
        */
        const username = user.username();
        if (await this.hasUser(username)) {
            throw new ValueAlreadyTakenError(`Username already taken: '${username}'`)
        } else {
            await this.#collection.insertOne(user);
        }
    }

    /**
     * Gets the User with the given username from the database.
     *
     * @param username the username of the User to fetch
     * @return the fetched User
     */
    async getUser(username) {
        /* Failures
        can't access database
        user not found
        */
        const query = {username: username};
        const matchingUsers = await this.#collection.find(query).toArray();
        if (matchingUsers.length === 0) {
            throw new NoSuchItemError(`Username not found: '${username}'`);
        } else {
            return matchingUsers[0];
        }
    }

    /**
     * Returns true if a User with the given username exists in the database.
     *
     * @param username the username of the User to fetch
     * @return true if the User was found, false otherwise
     */
    async hasUser(username) {
        /* Failures
        can't access database
        */
        const query = {username: username};
        const matchingUsers = await this.#collection.find(query).toArray();
        return matchingUsers.length > 0;
    }

    /**
     * Removes a single user from the database.
     *
     * @param user the user to remove
     */
    async removeUser(user) {
        /* Failures
        can't access database
        (if user DNE, just return)
        */
        const query = {username: user.username};
        await this.#collection.deleteMany(query);
    }

    /**
     * Removes every user from the database.
     */
    async clearUsers() {
        /* Failures
        can't access database
        (if no users, just return)
        */
        const query = {};
        await this.#collection.deleteMany(query);
    }

    async recordWin(username) {
        // TODO Test
        const user = await this.getUser(username);
        const newStats = {wins: user.stats.wins + 1, games: user.stats.games + 1};
        const userUpdates = {stats: newStats};

        const query = {username: username};
        await this.#collection.updateOne(query, userUpdates);
    }

    async recordLoss(username) {
        // TODO Test
        const user = await this.getUser(username);
        const newStats = {losses: user.stats.losses + 1, games: user.stats.games + 1};
        const userUpdates = {stats: newStats};

        const query = {username: username};
        await this.#collection.updateOne(query, userUpdates);
    }

}

module.exports = {UserDAO};