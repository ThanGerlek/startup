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

    async getUserData(username, tokenString) {
        console.log("Called getUserData()");
        const user = await this.#userDAO.getUser(username);

        const authenticatedUsername = await this.#authDAO.getUsernameFromTokenString(tokenString);

        const authenticated = username === authenticatedUsername;
        return new UserDataResponse("Retrieved user data.", user.username, authenticated, user.stats);
    }
}

module.exports = {GetUserDataService};
