'use strict';

const {MessageResponse} = require('../http');

class ClearApplicationService {
    #authDAO;
    #gameDAO;
    #gameRequestDAO;
    #userDAO;

    constructor(dataAccessManager) {
        this.#authDAO = dataAccessManager.getAuthDAO();
        this.#gameDAO = dataAccessManager.getGameDAO();
        this.#gameRequestDAO = dataAccessManager.getGameRequestDAO();
        this.#userDAO = dataAccessManager.getUserDAO();
    }

    clearApplication() {
        console.log("Called clearApplication()");
        this.#authDAO.clearTokens();
        this.#gameDAO.clearGames();
        this.#gameRequestDAO.clearGameRequests();
        this.#userDAO.clearUsers();

        return new MessageResponse("Cleared application.");
    }
}

module.exports = {ClearApplicationService};

// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Clears the database. Removes all users, games, and authTokens. |
// | **Success response** | [200]                                                          |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |
