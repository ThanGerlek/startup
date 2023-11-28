'use strict';

const {MessageResponse} = require('../http');

class LogoutService {
    #authDAO;

    constructor(dataAccessManager) {
        this.#authDAO = dataAccessManager.getAuthDAO();
    }

    async logout(tokenString) {
        console.log("Called logout()");
        await this.#authDAO.removeToken(tokenString);
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
