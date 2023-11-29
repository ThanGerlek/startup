'use strict';

const {ClearApplicationService} = require('./clearApplicationService');
const {JoinGameService} = require('./joinGameService');
const {LoginService} = require('./loginService');
const {LogoutService} = require('./logoutService');
const {RegisterService} = require('./registerService');
const {GetStatsService} = require('./getStatsService');

module.exports = {
    ClearApplicationService,
    JoinGameService,
    LoginService,
    LogoutService,
    RegisterService,
    GetStatsService,
};
