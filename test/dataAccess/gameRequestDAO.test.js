'use strict';

const {
    BadRequestError, NoSuchItemError, ValueAlreadyTakenError, DataAccessManager
} = require('../../server/dataAccess/dataAccess');
const {User} = require('../../server/models');
const {MongoClient} = require("mongodb");
const config = require("../../dbConfig.json");

let client;
let gameRequestDAO;
let userDAO;


beforeAll(async () => {
    client = new MongoClient(`mongodb+srv://${config.username}:${config.password}@${config.hostname}`);
    await client.connect();
    const dataAccessManager = new DataAccessManager(client.db(config.dbName));
    gameRequestDAO = dataAccessManager.getGameRequestDAO();
    userDAO = dataAccessManager.getUserDAO();
});

beforeEach(async () => {
    await gameRequestDAO.clearGameRequests();
    await userDAO.clearUsers();
    userDAO.insertNewUser(new User("user1", "pass1"));
    userDAO.insertNewUser(new User("user2", "pass2"));
    userDAO.insertNewUser(new User("user3", "pass3"));
    userDAO.insertNewUser(new User("user4", "pass4"));
});

afterAll(async () => {
    await gameRequestDAO.clearGameRequests();
    await userDAO.clearUsers();
    await client.close();
});


test('insert request does not error', () => {
    expect(() => gameRequestDAO.insertGameRequest("user1", "user2")).not.toThrow();
});


test('has inserted request returns true', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");
    expect(gameRequestDAO.hasGameRequest("user1", "user2")).toBe(true);
});


test('has inserted request with players in the opposite order still returns true', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");
    expect(gameRequestDAO.hasGameRequest("user2", "user1")).toBe(true);
});


test('has nonexistent request returns false', () => {
    expect(gameRequestDAO.hasGameRequest("user1", "user2")).toBe(false);
});


test('has request with only first player correct returns false', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");
    expect(gameRequestDAO.hasGameRequest("user1", "user3")).toBe(false);
});


test('has request with only second player correct returns false', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");
    expect(gameRequestDAO.hasGameRequest("user3", "user2")).toBe(false);
});


test('has removed request returns false', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");
    gameRequestDAO.removeGameRequest("user1", "user2");
    expect(gameRequestDAO.hasGameRequest("user1", "user2")).toBe(false);
});


test('insert same request twice throws already taken error', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");
    expect(() => gameRequestDAO.insertGameRequest("user1", "user2"))
        .toThrow(ValueAlreadyTakenError);
});


test('remove nonexistent request does not throw no such item error', () => {
    expect(() => gameRequestDAO.removeGameRequest("user1", "user2")).not.toThrow(NoSuchItemError);
});


test('remove request with invalid first player throws bad request error', () => {
    expect(() => gameRequestDAO.removeGameRequest("iDoNotExist", "user2")).toThrow(BadRequestError);
});


test('remove request with invalid second player throws bad request error', () => {
    expect(() => gameRequestDAO.removeGameRequest("user1", "iDoNotExist")).toThrow(BadRequestError);
});


test('has cleared games returns false', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");
    gameRequestDAO.insertGameRequest("user3", "user4");

    gameRequestDAO.clearGameRequests();

    expect(gameRequestDAO.hasGameRequest("user1", "user2")).toBe(false);
    expect(gameRequestDAO.hasGameRequest("user3", "user4")).toBe(false);
});


test('clear empty does not error', () => {
    expect(() => gameRequestDAO.clearGameRequests()).not.toThrow();
});


test('insert request with invalid first player throws bad request error', () => {
    expect(() => gameRequestDAO.insertGameRequest("iDoNotExist", "user2")).toThrow(BadRequestError);
});


test('insert request with invalid second player throws bad request error', () => {
    expect(() => gameRequestDAO.insertGameRequest("user1", "iDoNotExist")).toThrow(BadRequestError);
});