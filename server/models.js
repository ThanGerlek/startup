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
    #board;
    #isFirstPlayerTurn;

    constructor(board) {
        this.#board = board;
        this.#isFirstPlayerTurn = true;
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

    toggleTurn() {
        this.#isFirstPlayerTurn = !this.#isFirstPlayerTurn;
    }
}

module.exports = {User, Game, AuthToken};