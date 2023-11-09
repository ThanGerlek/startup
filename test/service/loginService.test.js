'use strict';

const request = require('supertest');
const app = require('../../server');

const dataAccess = require('../../server/dataAccess/dataAccess');
const models = require('../../server/models');
const services = require('../../server/services/services');
const httpObjects = require('../../server/http');
const {UnauthorizedAccessError} = require("../../server/dataAccess/dataAccess");

let authDAO;
let userDAO;

let service;

beforeEach(() => {
    authDAO = new dataAccess.AuthDAO();
    userDAO = new dataAccess.UserDAO();

    service = new services.LoginService(authDAO, userDAO);
});


test('invalid URL returns 404', (done) => {
    request(app)
        .put('/thing')
        .send({msg:'an invalid request'})
        .expect(404)
        .expect({})
        .end((err) => err ? done(err) : done());
});


// Positive test
test('successful_login_returns_valid_token', (done) =>  {
    const authRequest = new httpObjects.AuthRequest("user1", "pass1");
    const response = service.login(authRequest);
    expect(authDAO.isValidToken(response.token())).toBe(true);
});


// Negative test
test('login_incorrect_username_returns_forbidden', (done) =>  {
    const authRequest = new httpObjects.AuthRequest("user1", "iAmIncorrect");
    expect(() => service.login(authRequest)).toThrow(UnauthorizedAccessError);
});


test('login_incorrect_password_returns_forbidden', (done) =>  {
    const authRequest = new httpObjects.AuthRequest("user1", "iAmIncorrect");
    expect(() => service.login(authRequest)).toThrow(dataAccess.UnauthorizedAccessError);
});
