'use strict';

// Game Data Access
// TODO! db

let GameDAO = class {
    /**
     * Inserts a game into the database.
     * @param game the game to insert
     * @return the gameID of the inserted game
     */
    insertGame(game) {
        /* Failures
        can't access database
        */
        // TODO
    }

    /**
     * Returns the gameID of the game between the players if it exists, otherwise returns null
     *
     * @param player1
     * @param player2
     */
    findGame(player1, player2) {
        // TODO
        return -1;
    }

    /**
     * Fetches the game with the given ID from the database.
     *
     * @param gameID the ID of the game to fetch
     * @return the fetched game
     */
    getGameState(gameID) {
        /* Failures
        can't access database
        game not found
        */
        // TODO
        return null;
    }

    /**
     * Updates the game state of a game in the database to match the given version.
     *
     * @param gameID the ID of the game to update
     * @param game the updated version of the Game
     */
    updateGameState(gameID, game) {
        /* Failures
        can't access database
        game not found
        */
        // TODO
    }

    /**
     * Removes a single game from the database.
     *
     * @param gameID the ID of the Game to remove
     */
    removeGame(gameID) {
        /* Failures
        can't access database
        game not found
        */
        // TODO
    }

    /**
     * Removes every game from the database.
     */
    clearGames() {
        /* Failures
        can't access database
        */
        // TODO
    }
}

module.exports = GameDAO;