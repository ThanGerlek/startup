'use strict';

const {ValueAlreadyTakenError, DataAccessManager} = require("../../server/dataAccess/dataAccess");
const {MongoClient} = require("mongodb");
const config = require("../../dbConfig.json");

let client;
let authDAO;


beforeAll(async () => {
    client = new MongoClient(`mongodb+srv://${config.username}:${config.password}@${config.hostname}`);
    await client.connect();
    const dataAccessManager = new DataAccessManager(client.db(config.dbName));
    authDAO = dataAccessManager.getAuthDAO();
});

beforeEach(async () => {
    await authDAO.clearTokens();
});

afterAll(async () => {
    await authDAO.clearTokens();
    await client.close();
});


/**
 * Used to avoid race conditions in testing.
 */
async function delay(milliseconds) {
    if (!milliseconds) milliseconds = 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}


test('add same token twice rejects with ValueAlreadyTakenError', async () => {
    await authDAO.addToken('1234');

    await expect(() => authDAO.addToken('1234')).rejects.toBeInstanceOf(ValueAlreadyTakenError);
});


test('added token is valid', async () => {
    await authDAO.addToken("2345");
    await delay();
    expect(await authDAO.isValidToken("2345")).toBe(true);
});


test('nonexistent token is not valid', async () => {
    expect(await authDAO.isValidToken("iDoNotExist")).toBe(false);
});


test('removed token is not valid', async () => {
    await authDAO.addToken("3456");

    await authDAO.removeToken("3456");

    await delay();
    expect(await authDAO.isValidToken("3456")).toBe(false);
});


test('remove nonexistent token resolves successfully', () => {
    return authDAO.removeToken("iDoNotExist");
});


test('cleared token is invalid', async () => {
    await authDAO.addToken("4567");
    await authDAO.clearTokens();
    await delay();
    expect(await authDAO.isValidToken("4567")).toBe(false);
});