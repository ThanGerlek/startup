'use strict';

let MessageResponse = class {
    // clear, logout, join
    #message;

    constructor(message) {
        this.#message = message;
    }
};

let AuthResponse = class {
    // register, login
    #message;
    #token;

    constructor(message, token) {
        this.#message = message;
        this.#token = token;
    }
};

let AuthRequest = class {
    #username;
    #password;

    constructor(username, password) {
        this.#username = username;
        this.#password = password;
    }
};

let JoinGameRequest = class {
    #firstPlayerUsername;
    #secondPlayerUsername;

    constructor(firstPlayerUsername, secondPlayerUsername) {
        this.#firstPlayerUsername = firstPlayerUsername;
        this.#secondPlayerUsername = secondPlayerUsername;
    }
};

module.exports = {
    MessageResponse: MessageResponse,
    AuthResponse: AuthResponse,
    AuthRequest: AuthRequest,
    JoinGameRequest: JoinGameRequest
};
