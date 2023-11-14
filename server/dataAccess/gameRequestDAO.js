'use strict';

// GameRequest Data Access
// TODO! implement gameRequestDAO
// TODO db

class GameRequestDAO {
    #userDAO;

    constructor(userDAO) {
        this.#userDAO = userDAO;
    }

    /**
     * Inserts a GameRequest into the database.
     *
     * @param player1 the username of one of the players (order doesn't matter)
     * @param player2 the username of one of the players (order doesn't matter)
     */
    insertGameRequest(player1, player2) {

    }

    /**
     * Return true if a GameRequest between the given players exists in the database.
     *
     * @param player1 the username of one of the players (order doesn't matter)
     * @param player2 the username of one of the players (order doesn't matter)
     */
    hasGameRequest(player1, player2) {
        return false;
    }

    /**
     * Remove a GameRequest from the database.
     *
     * @param player1 the username of one of the players (order doesn't matter)
     * @param player2 the username of one of the players (order doesn't matter)
     */
    removeGameRequest(player1, player2) {

    }

    /**
     * Clear all GameRequests from the database.
     */
    clearGameRequests() {

    }

}

module.exports = {GameRequestDAO};
