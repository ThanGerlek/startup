'use strict';

// Game Data Access
// TODO! db

const {NoSuchItemError, BadRequestError} = require("./dataAccessErrors");

class GameDAO {
    #gameList;
    #userDAO;

    constructor(userDAO) {
        this.#gameList = [];
        this.#userDAO = userDAO;
    }

    // TODO. replace BadRequestError for invalid usernames with a better error type
    // TODO? extract invalid username checking to handler level?

    /**
     * Inserts a game into the database.
     * @param player1 the username of one of the players (order doesn't matter)
     * @param player2 the username of one of the players (order doesn't matter)
     * @param game the game to insert
     * @throws ValueAlreadyTakenError if a game between the players already exists
     * @throws BadRequestError if given an invalid username
     */
    insertGame(player1, player2, game) {
        // Failures: game already exists, invalid usernames
        this.#requirePlayers(player1, player2);
        let gameListItem = new GameListItem(player1, player2, game);
        this.#gameList.push(gameListItem);
    }

    /**
     * Fetches the game between the given players from the database.
     *
     * @param player1 the username of one of the players in the game (order does not matter)
     * @param player2 the username of the other player in the game (order does not matter)
     * @return the fetched game
     * @throws NoSuchItemError if the game is not found
     * @throws BadRequestError if given an invalid username
     */
    findGame(player1, player2) {
        // Failures: game not found, invalid usernames
        this.#requirePlayers(player1, player2);

        const gameIndex = this.#requireGameIndex(player1, player2);
        if (gameIndex < 0) {
            throw new NoSuchItemError(`Game not found for players '${player1}' and '${player2}'`);
        } else {
            return this.#gameList[gameIndex].game;
        }
    }

    #getGameIndex(player1, player2) {
        for (let i = 0; i < this.#gameList.length; i++) {
            if (this.#gameList[i].matches(player1, player2)) {
                return i;
            }
        }
        return -1;
    }

    #requireGameIndex(player1, player2) {
        const index = this.#getGameIndex(player1, player2);
        if (index < 0) {
            throw new NoSuchItemError(`Game not found for players '${player1}' and '${player2}'`);
        } else {
            return index;
        }
    }

    #requirePlayers(player1, player2) {
        if (!this.#userDAO.hasUser(player1) || !this.#userDAO.hasUser(player2)) {
            throw new BadRequestError('Failed to find game, invalid username was provided');
        }
    }

    /**
     * Updates the game state of a game in the database to match the given version.
     *
     * @param player1 the username of one of the players in the game (order does not matter)
     * @param player2 the username of the other player in the game (order does not matter)
     * @param game the updated version of the Game
     * @throws NoSuchItemError if the game is not found
     * @throws BadRequestError if given an invalid username
     */
    updateGameState(player1, player2, game) {
        // Failures: game not found, invalid usernames
        // TODO
        this.#requirePlayers(player1, player2);
        const gameIndex = this.#requireGameIndex(player1, player2);
        this.#gameList[gameIndex] = new GameListItem(player1, player2, game);
    }

    /**
     * Removes a single game from the database.
     *
     * @param player1 the username of one of the players in the game (order does not matter)
     * @param player2 the username of the other player in the game (order does not matter)
     * @throws BadRequestError if given an invalid username
     */
    removeGame(player1, player2) {
        // Failures: game not found, invalid usernames
        // TODO
        this.#requirePlayers(player1, player2);
        const gameIndex = this.#requireGameIndex(player1, player2);

    }

    /**
     * Removes every game from the database.
     */
    clearGames() {
        // TODO
    }
}

class GameListItem {
    player1;
    player2;
    game;

    constructor(player1, player2, game) {
        this.player1 = player1;
        this.player2 = player2;
        this.game = game;
    }

    matches(player, otherPlayer) {
        return (this.player1 === player && this.player2 === otherPlayer) || (this.player1 === otherPlayer && this.player2 === player);
    }
}

module.exports = {GameDAO};