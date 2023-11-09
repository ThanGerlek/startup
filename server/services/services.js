'use strict';

const ClearApplicationService = require('./clearApplication');
const JoinGameService = require('./joinGame');
const LoginService = require('./login');
const LogoutService = require('./logout');
const RegisterService = require('./register');

module.exports = {
    ClearApplicationService,
    JoinGameService,
    LoginService,
    LogoutService,
    RegisterService,

    getServicesFromDataSource: function (persistentData) {
        let authDAO = persistentData.authDAO;
        let gameDAO = persistentData.gameDAO;
        let gameRequestDAO = persistentData.gameRequestDAO;
        let userDAO = persistentData.userDAO;

        return {
            clearApplicationService: new ClearApplicationService(authDAO, gameDAO, gameRequestDAO, userDAO),
            joinGameService: new JoinGameService(authDAO, gameDAO, gameRequestDAO, userDAO),
            loginService: new LoginService(authDAO, gameDAO, gameRequestDAO, userDAO),
            logoutService: new LogoutService(authDAO, gameDAO, gameRequestDAO, userDAO),
            registerService: new RegisterService(authDAO, gameDAO, gameRequestDAO, userDAO),
        }
    }
};
