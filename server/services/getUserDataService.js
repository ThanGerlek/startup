'use strict';

const {StatsResponse} = require('../http');

// TODO! GetUserDataService tests!

class GetUserDataService {
    #userDAO;
    #authDAO;

    constructor(dataAccessManager) {
        this.#userDAO = dataAccessManager.getUserDAO();
        this.#authDAO = dataAccessManager.getAuthDAO();
    }

    async getUserData() {
        console.log("Called getStats()");
        const user = await this.#userDAO.getUser(getStatsRequest.username)

        return new StatsResponse("Retrieved stats.", user.username, user.stats);
    }
}

module.exports = {GetStatsService: GetUserDataService};

// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Returns stats for the current user.                            |
// | **Success response** | [200]                                                          |
// | **Failure response** | [401] `{ "message": "Unauthorized" }`                          |
// | **Failure response** | [???] `{ "message": "Bad request" }`                           |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |
