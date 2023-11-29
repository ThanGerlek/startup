'use strict';

const {UserDataResponse} = require('../http');

// TODO! GetUserDataService tests!

class GetUserDataService {
    #userDAO;
    #authDAO;

    constructor(dataAccessManager) {
        this.#userDAO = dataAccessManager.getUserDAO();
        this.#authDAO = dataAccessManager.getAuthDAO();
    }

    async getUserData(tokenString, username) {
        console.log("Called getUserData()");

        const authenticatedUsername = await this.#authDAO.getUsernameFromTokenString(tokenString);
        if (!username) {
            username = authenticatedUsername;
        }

        const authenticated = username === authenticatedUsername;
        const user = await this.#userDAO.getUser(username);

        return new UserDataResponse("Retrieved user data.", user.username, authenticated, user.stats);
    }
}

module.exports = {GetUserDataService};
