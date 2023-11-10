'use strict';

let User = class {
    #username;
    #password;

    constructor(username, password) {
        this.#username = username;
        this.#password = password;
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
    #gameID;
    #usernames;
    #board;
    #isFirstPlayerTurn;

    constructor(gameID, playerOneUsername, playerTwoUsername, board) {
        this.#gameID = gameID;
        this.#usernames = [playerOneUsername, playerTwoUsername];
        this.#board = board;
        this.#isFirstPlayerTurn = true;
    }

    getGameID() {
        return this.#gameID;
    }

    getUsernames() {
        return [this.#usernames[0], this.#usernames[1]];
    }

    getBoard() {
        return this.#board;
    }

    updateBoard(newBoard) {
        this.#board = newBoard;
    }

    playerTurn() {
        const index = this.#isFirstPlayerTurn ? 0 : 1;
        return this.#usernames[index];
    }

    toggleTurn() {
        this.#isFirstPlayerTurn = !this.#isFirstPlayerTurn;
    }
}

module.exports = {User, Game, AuthToken};