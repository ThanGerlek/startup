'use strict';

const {StatsResponse} = require('../http');

// TODO! GetStatsService tests!

class GetStatsService {
    #userDAO;

    constructor(dataAccessManager) {
        this.#userDAO = dataAccessManager.getUserDAO();
    }

    async getStats(getStatsRequest) {
        console.log("Called getStats()");
        const user = await this.#userDAO.getUser(getStatsRequest.username)

        return new StatsResponse("Retrieved stats.", user.username(), user.stats);
    }
}

module.exports = {GetStatsService};

// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Returns stats for the current user.                            |
// | **Success response** | [200]                                                          |
// | **Failure response** | [401] `{ "message": "Unauthorized" }`                          |
// | **Failure response** | [???] `{ "message": "Bad request" }`                           |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |
