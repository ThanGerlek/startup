const AuthDAO = require("./authDataAccess");
const GameDAO = require("./gameDataAccess");
const GameRequestDAO = require("./gameRequestDataAccess");
const UserDAO = require("./userDataAccess");

module.exports.getNewDAOs = function() {
    return {
        authDAO: new AuthDAO(), gameDAO: new GameDAO(), gameRequestDAO: new GameRequestDAO(), userDAO: new UserDAO()
    };
};

module.exports.AuthDAO = AuthDAO;
module.exports.GameDAO = GameDAO;
module.exports.GameRequestDAO = GameRequestDAO;
module.exports.UserDAO = UserDAO;
