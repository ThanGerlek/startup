'use strict';

// User Data Access
// TODO! db

class UserDAO {

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
        return null;
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
        return false;
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
    }

    /**
     * Removes every user from the database.
     */
    clearUsers() {
        /* Failures
        can't access database
        (if no users, just return)
        */
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