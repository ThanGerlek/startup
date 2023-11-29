'use strict';

const {UserDataResponse} = require('../http');

// TODO! GetUserDataService tests!

class GetUserDataService {
    #userDAO;
    #authDAO;

    constructor(dataAccessManager) {
        this.#userDAO = dataAccessManager.getUserDAO();
        this.#authDAO = dataAccessManager.getAuthDAO();
    }

    async getUserData(username, tokenString) {
        console.log("Called getUserData()");
        const user = await this.#userDAO.getUser(username);

        const authenticatedUsername = await this.#authDAO.getUsernameFromTokenString(tokenString);

        const authenticated = username === authenticatedUsername;
        return new UserDataResponse("Retrieved user data.", user.username, authenticated, user.stats);
    }
}

module.exports = {GetUserDataService};

// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Returns stats for the current user.                            |
// | **Success response** | [200]                                                          |
// | **Failure response** | [401] `{ "message": "Unauthorized" }`                          |
// | **Failure response** | [???] `{ "message": "Bad request" }`                           |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |
