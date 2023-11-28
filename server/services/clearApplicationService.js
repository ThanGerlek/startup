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

    async clearApplication() {
        console.log("Called clearApplication()");
        await this.#authDAO.clearTokens();
        this.#gameDAO.clearGames();
        this.#gameRequestDAO.clearGameRequests();
        await this.#userDAO.clearUsers();

        return new MessageResponse("Cleared application.");
    }
}

module.exports = {ClearApplicationService};

// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Clears the database. Removes all users, games, and authTokens. |
// | **Success response** | [200]                                                          |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |
