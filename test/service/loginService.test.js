'use strict';

const request = require('supertest');
const app = require('../../server');

const {AuthDAO, UserDAO} = require('../../server/dataAccess/dataAccess');
const {LoginService} = require('../../server/services/services');
const {AuthRequest} = require('../../server/http');
const {UnauthorizedAccessError} = require("../../server/dataAccess/dataAccess");

let authDAO;
let userDAO;

let service;

beforeEach(() => {
    authDAO = new AuthDAO();
    userDAO = new UserDAO();

    service = new LoginService(authDAO, userDAO);
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
    const authRequest = new AuthRequest("user1", "pass1");
    const response = service.login(authRequest);
    expect(authDAO.isValidToken(response.token())).toBe(true);
});


// Negative test
test('login_incorrect_username_returns_forbidden', (done) =>  {
    const authRequest = new AuthRequest("user1", "iAmIncorrect");
    expect(() => service.login(authRequest)).toThrow(UnauthorizedAccessError);
});


test('login_incorrect_password_returns_forbidden', (done) =>  {
    const authRequest = new AuthRequest("user1", "iAmIncorrect");
    expect(() => service.login(authRequest)).toThrow(UnauthorizedAccessError);
});
