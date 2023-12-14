const bcrypt = require('bcrypt');
const uuid = require("uuid");
const cryptConfig = require('../config.json').crypt;

const {AuthResponse} = require('../http');
const {ValueAlreadyTakenError, BadRequestError} = require("../dataAccess/dataAccess");
const {User} = require("../models");

class RegisterService {
    #authDAO;
    #userDAO;

    constructor(dataAccessManager) {
        this.#authDAO = dataAccessManager.getAuthDAO();
        this.#userDAO = dataAccessManager.getUserDAO();
    }

    async register(authRequest) {
        console.log("Called register()");

        const username = authRequest.username;
        const password = authRequest.password;

        if (await this.#userDAO.hasUser(username)) {
            throw new ValueAlreadyTakenError(`Failed to register, username ${username} is already taken`);
        } else {
            this.#requireUsernameAndPasswordValidation(username, password);

            this.#hashAndStoreCredentials(username, password);

            const tokenString = await this.#generateTokenString(username);

            return new AuthResponse(`Registered new user successfully`, tokenString, username);
        }
    }

    async #generateTokenString(username) {
        const tokenString = uuid.v4();
        await this.#authDAO.addToken(tokenString, username);
        return tokenString;
    }

    #hashAndStoreCredentials(username, password) {
        bcrypt.hash(password, cryptConfig.saltRounds, async (err, hash) => {
            const user = new User(username, hash);
            await this.#userDAO.insertNewUser(user);
        });
    }

    #requireUsernameAndPasswordValidation(username, password) {
        if (!username) throw new BadRequestError('Please enter a username.');
        // TODO! Sanitize against injection attacks
        if (!password) throw new BadRequestError('Please enter a password.');
        if (password.length < 12) throw new BadRequestError('Password must be at least 12 characters.');
        if (password === username) throw new BadRequestError('Username and password cannot match.');
    }

}

module.exports = {RegisterService};
