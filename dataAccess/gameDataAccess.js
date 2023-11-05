'use strict';

// Game Data Access
// TODO! db

/**
 * Inserts a game into the database.
 * @param game the game to insert
 * @return the gameID of the inserted game
 */
function insertGame(game) {
    /* Failures
    can't access database
    */
}

/**
 * Returns the gameID of the game between the players if it exists, otherwise returns null
 *
 * @param player1
 * @param player2
 */
function findGame(player1, player2) {
    return -1;
}

/**
 * Fetches the game with the given ID from the database.
 *
 * @param gameID the ID of the game to fetch
 * @return the fetched game
 */
function getGameState(gameID) {
    /* Failures
    can't access database
    game not found
    */
    return null;
}

/**
 * Updates the game state of a game in the database to match the given version.
 *
 * @param gameID the ID of the game to update
 * @param game the updated version of the Game
 */
function updateGameState(gameID, game) {
    /* Failures
    can't access database
    game not found
    */
}

/**
 * Removes a single game from the database.
 *
 * @param gameID the ID of the Game to remove
 */
function removeGame(gameID) {
    /* Failures
    can't access database
    game not found
    */
}

/**
 * Removes every game from the database.
 */
function clearGames() {
    /* Failures
    can't access database
    */
}

export {insertGame, findGame, getGameState, updateGameState, removeGame, clearGames};
