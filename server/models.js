'use strict';

let User = class {
    #username;
    #password;
    stats;

    constructor(username, password) {
        this.#username = username;
        this.#password = password;
        this.stats = {
            wins: 0, losses: 0, games: 0,
        };
    }

    username() {
        return this.#username;
    }

    password() {
        return this.#password;
    }
}

let AuthToken = class {
    #token;

    constructor(token) {
        this.#token = token;
    }

    token() {
        return this.#token;
    }
}

let Game = class {
    #board;
    #isFirstPlayerTurn;
    #firstPlayer;
    #secondPlayer;
    // TODO add/update usernames in server contexts (store both usernames AND turn)

    constructor(board, isFirstPlayerTurn) {
        this.#board = board;
        this.#isFirstPlayerTurn = isFirstPlayerTurn;
    }

    getBoard() {
        return this.#board;
    }

    updateBoard(newBoard) {
        this.#board = newBoard;
    }

    isFirstPlayerTurn() {
        return this.#isFirstPlayerTurn;
    }

    playerTurn() {
        if (this.isFirstPlayerTurn()) {
            return this.#firstPlayer;
        } else {
            return this.#secondPlayer;
        }
    }

    toggleTurn() {
        this.#isFirstPlayerTurn = !this.#isFirstPlayerTurn;
    }

    firstPlayer() {
        return this.#firstPlayer;
    }

    secondPlayer() {
        return this.#secondPlayer;
    }
}

module.exports = {User, Game, AuthToken};