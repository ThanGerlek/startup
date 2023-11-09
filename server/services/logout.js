'use strict';

const httpObjects = require('../http');

const LogoutService = class {
    #authDAO;

    constructor(authDAO) {
        this.#authDAO = authDAO;
    }

    logout() {
        // TODO! services
        console.log("Called logout()");

        return new httpObjects.MessageResponse("Logged out.");
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
