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
