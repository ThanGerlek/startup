'use strict';

const {ClearApplicationService} = require('./clearApplicationService');
const {JoinGameService} = require('./joinGameService');
const {LoginService} = require('./loginService');
const {LogoutService} = require('./logoutService');
const {RegisterService} = require('./registerService');

module.exports = {
    ClearApplicationService, JoinGameService, LoginService, LogoutService, RegisterService,

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
