'use strict';

const {AuthResponse, MessageResponse} = require('../http');
const {UnauthorizedAccessError} = require("../dataAccess/dataAccess");

class LoginService {
    #authDAO;
    #userDAO;

    constructor(authDAO, userDAO) {
        this.#authDAO = authDAO;
        this.#userDAO = userDAO;
    }

    login(authRequest) {
        console.log("Called login()");

        const username = authRequest.username;
        const password = authRequest.password;

        return this.#authenticate(username, password);
    }

    #authenticate(username, password) {
        if (!this.#userDAO.hasUser(username)) { // TODO? Unneeded?
            return new MessageResponse(`Invalid username: '${username}'`);
        }

        const user = this.#userDAO.getUser(username);
        if (user.password() === password) {
            const token = this.#generateToken();
            this.#authDAO.addToken(token);
            return new AuthResponse("Logged in.", token, username);
        } else {
            return new UnauthorizedAccessError("Invalid credentials");
        }
    }

    #generateToken() {
        // TODO! Replace with something cryptographically secure!
        return JSON.stringify(Math.random() * 2749871491 + Math.random());
    }
}

module.exports = {LoginService};

// | **Request class**    | LoginRequest                                    |
// | **Response class**   | AuthResponse                                    |
// | **Description**      | Logs in an existing user (returns a new token). |
// | **Body**             | `{ "username":"", "password":"" }`              |
// | **Success response** | [200] `{ "username":"", "token":"" }`           |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }`    |
// | **Failure response** | [500] `{ "message": "Error: description" }`     |
