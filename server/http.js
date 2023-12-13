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

let UserDataResponse = class extends MessageResponse {
    username;
    authenticated;
    stats;

    constructor(message, username, authenticated, stats) {
        super(message);
        this.username = username;
        this.authenticated = authenticated;
        this.stats = stats;
    }

    get stats() {
        return this.stats;
    }

    get authenticated() {
        return this.authenticated;
    }

    get username() {
        return this.username;
    }
};

let AuthResponse = class extends MessageResponse {
    // register, login
    token;
    username;

    constructor(message, token, username) {
        super(message);
        this.token = token;
        this.username = username;
    }

    get token() {
        return this.token;
    }

    get username() {
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
    MessageResponse, ErrorResponse, UserDataResponse, AuthResponse, AuthRequest, JoinGameRequest
};
