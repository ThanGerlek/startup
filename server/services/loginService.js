'use strict';

const {AuthResponse} = require('../http');
const {UnauthorizedAccessError, NoSuchItemError} = require("../dataAccess/dataAccess");
const bcrypt = require('bcrypt')
const uuid = require('uuid');

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
        let token;
        bcrypt.compare(password, user.hash, async (err, result) => {
            token = (result) ? uuid.v4() : null;
        });
        if (token) {
            await this.#authDAO.addToken(token);
            return new AuthResponse("Logged in.", token, username);
        } else {
            throw new UnauthorizedAccessError("Invalid credentials");
        }
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
