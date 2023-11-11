const {AuthDAO} = require("./authDAO");
const {GameDAO} = require("./gameDAO");
const {GameRequestDAO} = require("./gameRequestDAO");
const {UserDAO} = require("./userDAO");


class DataAccessError extends Error {
}

class BadRequestError extends DataAccessError {
}

class NoSuchItemError extends DataAccessError {
}

class UnauthorizedAccessError extends DataAccessError {
}

class ValueAlreadyTakenError extends DataAccessError {
}


module.exports = {
    AuthDAO,
    GameDAO,
    GameRequestDAO,
    UserDAO,
    DataAccessError,
    BadRequestError,
    NoSuchItemError,
    ValueAlreadyTakenError,
    UnauthorizedAccessError,
    getNewDAOs: function () {
        const userDAO = new UserDAO();
        return {
            authDAO: new AuthDAO(),
            gameDAO: new GameDAO(userDAO),
            gameRequestDAO: new GameRequestDAO(userDAO),
            userDAO: userDAO
        };
    }
};