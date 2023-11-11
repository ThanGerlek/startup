'use strict';

const {AuthDAO, NoSuchItemError, ValueAlreadyTakenError} = require("../../server/dataAccess/dataAccess");

let authDAO;

beforeEach(() => {
    authDAO = new AuthDAO();
});


test('addSameTokenTwiceErrors', () => {
    authDAO.addToken("1234");
    expect(() => authDAO.addToken("1234")).toThrow(ValueAlreadyTakenError);
});


test('addedTokenIsValid', () => {
    authDAO.addToken("1234");
    expect(authDAO.isValidToken("1234")).toBe(true);
});


test('nonexistentTokenIsNotValid', () => {
    expect(authDAO.isValidToken("iDoNotExist")).toBe(false);
});


test('removedTokenIsNotValid', () => {
    authDAO.addToken("1234");
    authDAO.removeToken("1234");
    expect(authDAO.isValidToken("1234")).toBe(false);
});


test('remove nonexistent token does not throw no such item error', () => {
    expect(() => authDAO.removeToken("iDoNotExist")).not.toThrow(NoSuchItemError);
});


test('clearedAuthTokensAreInvalid', () => {
    authDAO.addToken("1234");
    authDAO.addToken("5678");

    authDAO.clearTokens();

    expect(authDAO.isValidToken("1234")).toBe(false);
    expect(authDAO.isValidToken("5678")).toBe(false);
});
