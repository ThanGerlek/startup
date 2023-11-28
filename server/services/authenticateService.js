'use strict';

const {MessageResponse} = require('../http');
const {UnauthorizedAccessError} = require("../dataAccess/dataAccess");

// TODO Delete and replace with real authentication

class AuthenticateService {
    #authDAO;

    constructor(dataAccessManager) {
        this.#authDAO = dataAccessManager.getAuthDAO();
    }

    async authenticateToken(tokenString) {
        console.log("Called authenticate()");

        if (await this.#authDAO.isValidToken(tokenString)) {
            return new MessageResponse(`OK`);
        } else {
            throw new UnauthorizedAccessError(`Failed to authenticate, provided token was invalid`);
        }
    }
}

module.exports = {AuthenticateService};
