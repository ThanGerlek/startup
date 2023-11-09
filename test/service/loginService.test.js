'use strict';

const request = require('supertest');
const app = require('../../server');

let persistentData;
let services;
let service;

beforeEach(() => {
    persistentData = require('../../server/dataAccess/dataAccess');
    services = require('../../server/services/services').getServicesFromDataSource(persistentData);
    service = services.loginService;
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