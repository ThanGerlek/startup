'use strict';

const {MessageResponse} = require('../http');

class LogoutService {
    #authDAO;

    constructor(dataAccessManager) {
        this.#authDAO = dataAccessManager.getAuthDAO();
    }

    logout() {
        // TODO! services
        console.log("Called logout()");

        return new MessageResponse("Logged out.");
    }
}

module.exports = {LogoutService};

// | **Request class**    | N/A (no request body)                        |
// | **Response class**   | MessageResponse                              |
// | **Description**      | Logs out the user represented by the token.  |
// | **Headers**          | `authorization: <token>`                     |
// | **Success response** | [200]                                        |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`  |
