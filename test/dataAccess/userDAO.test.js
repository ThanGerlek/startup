'use strict';

const {
    NoSuchItemError, ValueAlreadyTakenError, DataAccessManager
} = require('../../server/dataAccess/dataAccess');
const {User} = require('../../server/models');
const {MongoClient} = require("mongodb");
const dbConfig = require("../../config.json").database;

let client;
let userDAO;
const user1 = new User("user1", "pass1");
const user2 = new User("user2", "pass2");

beforeAll(async () => {
    client = new MongoClient(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.hostname}`);
    await client.connect();
    const dataAccessManager = new DataAccessManager(client.db(dbConfig.dbName));
    userDAO = dataAccessManager.getUserDAO();
});

beforeEach(async () => {
    await userDAO.clearUsers();
});

afterAll(async () => {
    await userDAO.clearUsers();
    await client.close();
});


test('insert valid user does not throw', () => {
    expect(() => userDAO.insertNewUser(user1)).not.toThrow();
});


test('insert users with same username throws already taken error', () => {
    userDAO.insertNewUser(user1);
    expect(() => userDAO.insertNewUser(new User("user1", "pass2"))).toThrow(ValueAlreadyTakenError);
});


test('insert users with same password does not throw already taken error', () => {
    userDAO.insertNewUser(user1);
    expect(() => userDAO.insertNewUser(new User("user2", "pass1"))).not.toThrow(ValueAlreadyTakenError);
});


test('get inserted user returns nonnull', () => {
    userDAO.insertNewUser(user1);
    expect(userDAO.getUser("user1")).not.toBeNull();
});


test('get inserted user returns correct username and password', () => {
    userDAO.insertNewUser(user1);

    const fetchedUser = userDAO.getUser("user1");
    expect(fetchedUser).toBe(user1);
});


test('get invalid user throws no such item error', () => {
    expect(() => userDAO.getUser("iDoNotExist")).toThrow(NoSuchItemError);
});


test('has inserted user returns true', () => {
    userDAO.insertNewUser(user1);
    expect(userDAO.hasUser("user1")).toBe(true);
});


test('has nonexistent user returns false', () => {
    expect(userDAO.hasUser("iDoNotExist")).toBe(false);
});


test('has removed user returns false', () => {
    userDAO.insertNewUser(user1);
    userDAO.removeUser(user1);
    expect(userDAO.hasUser("user1")).toBe(false);
});


test('remove nonexistent user does not throw no such item error', () => {
    expect(() => userDAO.removeUser("iDoNotExist")).not.toThrow(NoSuchItemError);
});


test('has cleared users returns false', () => {
    userDAO.insertNewUser(user1);
    userDAO.insertNewUser(user2);
    userDAO.clearUsers();
    expect(userDAO.hasUser("user1")).toBe(false);
    expect(userDAO.hasUser("user2")).toBe(false);
});


test('clear empty does not throw no such item error', () => {
    expect(() => userDAO.clearUsers()).not.toThrow(NoSuchItemError);
});