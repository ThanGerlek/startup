const {AuthDAO} = require("./authDataAccess");
const {GameDAO} = require("./gameDataAccess");
const {GameRequestDAO} = require("./gameRequestDataAccess");
const {UserDAO} = require("./userDataAccess");


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
        return {
            authDAO: new AuthDAO(), gameDAO: new GameDAO(), gameRequestDAO: new GameRequestDAO(), userDAO: new UserDAO()
        };
    }
};