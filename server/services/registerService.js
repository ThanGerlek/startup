'use strict';

const {AuthResponse} = require('../http');
const {ValueAlreadyTakenError} = require("../dataAccess/dataAccess");
const {User} = require("../models");

class RegisterService {
    #authDAO;
    #userDAO;

    constructor(authDAO, userDAO) {
        this.#authDAO = authDAO;
        this.#userDAO = userDAO;
    }

    register(authRequest) {
        console.log("Called register()");

        const username = authRequest.username;
        const password = authRequest.password;

        if (this.#userDAO.hasUser(username)) {
            throw new ValueAlreadyTakenError(`Failed to register, username ${username} is already taken`);
        } else {
            const user = new User(username, password);
            this.#userDAO.insertNewUser(user);

            const token = this.#generateToken();
            this.#authDAO.addToken(token);

            return new AuthResponse(`Registered new user successfully`, token, username);
        }
    }

    // TODO remove duplicated code from loginService.js
    #generateToken() {
        // TODO! Replace with something cryptographically secure!
        return JSON.stringify(Math.random() * 2749871491 + Math.random());
    }
}

module.exports = {RegisterService};

// | **Request class**    | RegisterRequest                               |
// | **Response class**   | AuthResponse                                  |
// | **Description**      | Register a new user.                          |
// | **Body**             | `{ "username":"", "password":"" }`            |
// | **Success response** | [200] `{ "username":"", "token":"" }`         |
// | **Failure response** | [400] `{ "message": "Error: bad request" }`   |
// | **Failure response** | [403] `{ "message": "Error: already taken" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`   |
