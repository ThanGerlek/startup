'use strict';

const ClearApplicationService = class {
    #authDAO;
    #gameDAO;
    #gameRequestDAO;
    #userDAO;

    constructor(persistentData) {
        this.#authDAO = persistentData.authDAO;
        this.#gameDAO = persistentData.gameDAO;
        this.#gameRequestDAO = persistentData.gameRequestDAO;
        this.#userDAO = persistentData.userDAO;
    }

    clearApplication() {
        console.log("Called clearApplication()");
        this.#authDAO.clearTokens();
        this.#gameDAO.clearGames();
        this.#gameRequestDAO.clearGameRequests();
        this.#userDAO.clearUsers();
    }
}

module.exports = ClearApplicationService;

// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Clears the database. Removes all users, games, and authTokens. |
// | **Success response** | [200]                                                          |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |
