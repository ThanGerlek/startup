'use strict';

// User Data Access
// TODO! db

/**
 * Adds a new User to the database.
 *
 * @param user the User to insert
 */
function insertNewUser(user) {
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
function getUser(username) {
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
function hasUser(username) {
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
function removeUser(user) {
    /* Failures
    can't access database
    (if user DNE, just return)
    */
}

/**
 * Removes every user from the database.
 */
function clearUsers() {
    /* Failures
    can't access database
    (if no users, just return)
    */
}

export {insertNewUser, getUser, hasUser, removeUser, clearUsers};
