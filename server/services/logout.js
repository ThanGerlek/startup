'use strict';

const LogoutService = class {
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

    logout() {
        // TODO! services
        console.log("Called logout()");
    }
}

module.exports = LogoutService;

// | **Request class**    | N/A (no request body)                        |
// | **Response class**   | MessageResponse                              |
// | **Description**      | Logs out the user represented by the token.  |
// | **Headers**          | `authorization: <token>`                     |
// | **Success response** | [200]                                        |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`  |
