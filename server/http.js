'use strict';

let MessageResponse = class {
    // clear, logout, join
    message;

    constructor(message) {
        this.message = message;
    }

    get message() {
        return this.message;
    }
};

let ErrorResponse = class extends MessageResponse {
    error;

    constructor(message, error) {
        super(message);
        this.error = error;
    }

    get error() {
        return this.error;
    }
};

let StatsResponse = class extends MessageResponse {
    username;
    stats;

    constructor(message, username, stats) {
        super(message);
        this.username = username;
        this.stats = stats;
    }

    get stats() {
        return this.stats;
    }

    get username() {
        return this.username;
    }
};

let AuthResponse = class extends MessageResponse {
    // register, login
    token;

    constructor(message, token) {
        super(message);
        this.token = token;
    }

    get token() {
        return this.token;
    }
};

let AuthRequest = class {
    username;
    password;

    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    get username() {
        return this.username;
    }

    get password() {
        return this.password;
    }
};

let JoinGameRequest = class {
    firstPlayerUsername;
    secondPlayerUsername;

    constructor(firstPlayerUsername, secondPlayerUsername) {
        this.firstPlayerUsername = firstPlayerUsername;
        this.secondPlayerUsername = secondPlayerUsername;
    }

    get firstPlayerUsername() {
        return this.firstPlayerUsername;
    }

    get secondPlayerUsername() {
        return this.secondPlayerUsername;
    }

};

module.exports = {
    MessageResponse, ErrorResponse, StatsResponse, AuthResponse, AuthRequest, JoinGameRequest
};
