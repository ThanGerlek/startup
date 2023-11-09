'use strict';

const request = require('supertest');
const app = require('../../server');

const dataAccess = require('../../server/dataAccess/dataAccess');
const models = require('../../server/models');
const ClearApplicationService = require('../../server/services/clearApplication');

let authDAO;
let gameDAO;
let gameRequestDAO;
let userDAO;

let service;

beforeEach(() => {
    authDAO = new dataAccess.AuthDAO();
    gameDAO = new dataAccess.GameDAO();
    gameRequestDAO = new dataAccess.GameRequestDAO();
    userDAO = new dataAccess.UserDAO();

    service = new ClearApplicationService(persistentData);
});


test('invalid URL returns 404', (done) => {
    request(app)
        .put('/thing')
        .send({msg: 'an invalid request'})
        .expect(404)
        .expect({})
        .end((err) => err ? done(err) : done());
});


// Positive test
test('has_cleared_Users_is_false', (done) => {
    userDAO.insertNewUser(new models.User("user1", "pass1"));
    userDAO.insertNewUser(new models.User("user2", "pass2"));

    service.clearApplication();

    expect(userDAO.hasUser("user1")).toBe(false);
    expect(userDAO.hasUser("user2")).toBe(false);
});


test('clearing_does_not_throw', (done) => {
    expect(() => service.clearApplication()).not.toThrow();
});


test('clearing_twice_does_not_throw', (done) => {
    service.clearApplication();
    expect(() => service.clearApplication()).not.toThrow();
});


test('finding_cleared_Games_errors', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('finding_cleared_GameRequests_errors', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('cleared_AuthTokens_are_invalid', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});
