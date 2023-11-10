'use strict';

const {AuthDAO, UserDAO} = require('../../server/dataAccess/dataAccess');
const {LogoutService} = require('../../server/services/services');
const {UnauthorizedAccessError} = require("../../server/dataAccess/dataAccess");

const token = "1234";

let authDAO;
let userDAO;

let service;

beforeEach(() => {
    authDAO = new AuthDAO();
    userDAO = new UserDAO();

    service = new LogoutService(authDAO, userDAO);
});


// Positive test
test('logout_existing_token_invalidates_token', () => {
    authDAO.addToken(token);
    service.logout(token);
    expect(authDAO.isValidToken(token)).toBe(false);
});


// Negative test
test('logout_invalid_token_errors', () => {
    expect(() => service.logout("iAmIncorrect")).toThrow(UnauthorizedAccessError);
});


test('logout_token_twice_errors', () => {
    authDAO.addToken(token);
    service.logout(token);
    expect(() => service.logout(token)).toThrow(UnauthorizedAccessError);
});