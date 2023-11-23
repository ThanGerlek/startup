'use strict';

// User Data Access

const {NoSuchItemError, ValueAlreadyTakenError} = require("./dataAccessErrors");

class UserDAO {
    #userList;

    constructor(mongoDatabase) {
        // TODO use database
        this.clearUsers();
        // this.#userList = [new User("john", "1234")];
    }

    /**
     * Adds a new User to the database.
     *
     * @param user the User to insert
     */
    insertNewUser(user) {
        /* Failures
        can't access database
        username already exists
        */
        const username = user.username();
        if (this.hasUser(username)) {
            throw new ValueAlreadyTakenError(`Username already taken: '${username}'`)
        } else {
            this.#userList.push(user);
        }
    }

    #getIndexOf(username) {
        for (let i = 0; i < this.#userList.length; i++) {
            if (this.#userList[i].username() === username) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Gets the User with the given username from the database.
     *
     * @param username the username of the User to fetch
     * @return the fetched User
     */
    getUser(username) {
        /* Failures
        can't access database
        user not found
        */
        let index = this.#getIndexOf(username);
        if (index < 0) {
            throw new NoSuchItemError(`Username not found: '${username}'`);
        } else {
            return this.#userList[index];
        }
    }

    /**
     * Returns true if a User with the given username exists in the database.
     *
     * @param username the username of the User to fetch
     * @return true if the User was found, false otherwise
     */
    hasUser(username) {
        /* Failures
        can't access database
        */
        let index = this.#getIndexOf(username);
        return index >= 0;
    }

    /**
     * Removes a single user from the database.
     *
     * @param user the user to remove
     */
    removeUser(user) {
        /* Failures
        can't access database
        (if user DNE, just return)
        */
        let index = this.#getIndexOf(user.username());
        if (index >= 0) {
            this.#userList.splice(index, 1);
        }
    }

    /**
     * Removes every user from the database.
     */
    clearUsers() {
        /* Failures
        can't access database
        (if no users, just return)
        */
        this.#userList = [];
    }

    recordWin(username) {
        let user = this.getUser(username);
        user.stats.wins++;
        user.stats.games++;
    }

    recordLoss(username) {
        let user = this.getUser(username);
        user.stats.wins++;
        user.stats.games++;
    }

}

module.exports = {UserDAO};