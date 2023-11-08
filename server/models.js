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
    // TODO
}

module.exports = {User: User, Game: Game, AuthToken: AuthToken}; // TODO Does this work properly?