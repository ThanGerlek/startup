'use strict';

const {ClearApplicationService} = require('./clearApplicationService');
const {JoinGameService} = require('./joinGameService');
const {LoginService} = require('./loginService');
const {LogoutService} = require('./logoutService');
const {RegisterService} = require('./registerService');
const {GetStatsService} = require('./getStatsService');

module.exports = {
    ClearApplicationService, JoinGameService, LoginService, LogoutService, RegisterService, GetStatsService,

    getServicesFromDataSource: function (persistentData) {
        let authDAO = persistentData.authDAO;
        let gameDAO = persistentData.gameDAO;
        let gameRequestDAO = persistentData.gameRequestDAO;
        let userDAO = persistentData.userDAO;

        return {
            clearApplicationService: new ClearApplicationService(authDAO, gameDAO, gameRequestDAO, userDAO),
            joinGameService: new JoinGameService(gameDAO, gameRequestDAO, userDAO),
            loginService: new LoginService(authDAO, userDAO),
            logoutService: new LogoutService(authDAO),
            registerService: new RegisterService(authDAO, userDAO),
            getStatsService: new GetStatsService(userDAO),
        }
    }
};
