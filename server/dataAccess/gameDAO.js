'use strict';

// Game Data Access
// TODO! db

class GameDAO {
    /**
     * Inserts a game into the database.
     * @param game the game to insert
     */
    insertGame(game) {
        /* Failures
        can't access database
        */
        // TODO
    }

    /**
     * Fetches the game between the given players from the database.
     *
     * @param firstPlayer the username of one of the players in the game (order does not matter)
     * @param secondPlayer the username of the other player in the game (order does not matter)
     * @return the fetched game
     */
    findGame(firstPlayer, secondPlayer) {
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
     * @param firstPlayer the username of one of the players in the game (order does not matter)
     * @param secondPlayer the username of the other player in the game (order does not matter)
     * @param game the updated version of the Game
     */
    updateGameState(firstPlayer, secondPlayer, game) {
        /* Failures
        can't access database
        game not found
        */
        // TODO
    }

    /**
     * Removes a single game from the database.
     *
     * @param firstPlayer the username of one of the players in the game (order does not matter)
     * @param secondPlayer the username of the other player in the game (order does not matter)
     */
    removeGame(firstPlayer, secondPlayer) {
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

module.exports = {GameDAO};