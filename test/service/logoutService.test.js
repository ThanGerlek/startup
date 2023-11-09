'use strict';

const request = require('supertest');
const app = require('../../server');

const dataAccess = require('../../server/dataAccess/dataAccess');
const models = require('../../server/models');
const services = require('../../server/services/services');

let authDAO;
let userDAO;

let service;

beforeEach(() => {
    authDAO = new dataAccess.AuthDAO();
    userDAO = new dataAccess.UserDAO();

    service = new services.LogoutService(authDAO, userDAO);
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

test('logout_existing_user_invalidates_token', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});

// Negative test

test('logout_fake_user_returns_bad_request_error', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('logout_existing_user_returns_okay', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('logout_invalid_token_errors', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});