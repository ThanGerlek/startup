const {AuthResponse} = require('../http');
const {UnauthorizedAccessError, NoSuchItemError} = require("../dataAccess/dataAccess");
const bcrypt = require('bcrypt')
const uuid = require('uuid');

class LoginService {
    #authDAO;
    #userDAO;

    constructor(dataAccessManager) {
        this.#authDAO = dataAccessManager.getAuthDAO();
        this.#userDAO = dataAccessManager.getUserDAO();
    }

    async login(authRequest) {
        console.log("Called login()");

        const username = authRequest.username;
        const password = authRequest.password;

        if (!(await this.#userDAO.hasUser(username))) { // TODO? Unneeded?
            throw new NoSuchItemError(`Unrecognized username '${username}'`);
        }

        const user = await this.#userDAO.getUser(username);
        if (await bcrypt.compare(password, user.hash)) {
            const tokenString = uuid.v4();
            await this.#authDAO.addToken(tokenString, username);
            return new AuthResponse("Logged in.", tokenString, username);
        } else {
            throw new UnauthorizedAccessError("Invalid credentials");
        }
    }
}

module.exports = {LoginService};
