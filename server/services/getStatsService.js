'use strict';

const {StatsResponse} = require('../http');

class GetStatsService {
    #userDAO;

    constructor(userDAO) {
        this.#userDAO = userDAO;
    }

    getStats(getStatsRequest) {
        console.log("Called getStats()");
        const user = this.#userDAO.findUser(getStatsRequest.username)

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
