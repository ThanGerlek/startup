'use strict';

const {AuthResponse} = require('../http');
const {UnauthorizedAccessError, NoSuchItemError} = require("../dataAccess/dataAccess");

class LoginService {
    #authDAO;
    #userDAO;

    constructor(dataAccessManager) {
        this.#authDAO = dataAccessManager.getAuthDAO();
        this.#userDAO = dataAccessManager.getUserDAO();
    }

    login(authRequest) {
        console.log("Called login()");

        const username = authRequest.username;
        const password = authRequest.password;

        return this.#authenticate(username, password);
    }

    async #authenticate(username, password) {
        if (!(await this.#userDAO.hasUser(username))) { // TODO? Unneeded?
            throw new NoSuchItemError(`Unrecognized username '${username}'`);
        }

        const user = await this.#userDAO.getUser(username);
        if (user.password === password) {
            const token = this.#generateToken();
            await this.#authDAO.addToken(token);
            return new AuthResponse("Logged in.", token, username);
        } else {
            throw new UnauthorizedAccessError("Invalid credentials");
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
