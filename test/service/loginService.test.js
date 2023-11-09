'use strict';

const request = require('supertest');
const app = require('../../server');

const dataAccess = require('../../server/dataAccess/dataAccess');
const models = require('../../server/models');
const ClearApplicationService = require('../../server/services/clearApplication');

let authDAO;
let userDAO;

let service;

beforeEach(() => {
    authDAO = new dataAccess.AuthDAO();
    userDAO = new dataAccess.UserDAO();

    service = new ClearApplicationService(persistentData);
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
 
test('login_successfully_returns_valid_authToken', (done) =>  {
    throw new Error("Unimplemented test!"); // TODO test
});

// Negative test
 
test('login_incorrect_password_returns_forbidden', (done) =>  {
    throw new Error("Unimplemented test!"); // TODO test
});

 
test('login_successfully_returns_okay', (done) =>  {
    throw new Error("Unimplemented test!"); // TODO test
});

 
test('login_successfully_returns_authToken', (done) =>  {
    throw new Error("Unimplemented test!"); // TODO test
});

 
test('login_incorrect_username_returns_forbidden', (done) =>  {
    throw new Error("Unimplemented test!"); // TODO test
});