'use strict';

const ClearApplicationService = require('./clearApplication');
const JoinGameService = require('./joinGame');
const LoginService = require('./login');
const LogoutService = require('./logout');
const RegisterService = require('./register');

function getServicesFromDataSource(persistentData) {
    return {
        clearApplicationService: new ClearApplicationService(persistentData),
        joinGameService: new JoinGameService(persistentData),
        loginService: new LoginService(persistentData),
        logoutService: new LogoutService(persistentData),
        registerService: new RegisterService(persistentData),
    }
}

module.exports.getServicesFromDataSource = getServicesFromDataSource;
