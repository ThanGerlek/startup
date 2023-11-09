'use strict';

const request = require('supertest');
const app = require('../../server');

let persistentData;
let services;
let service;

beforeEach(() => {
    persistentData = require('../../server/dataAccess/dataAccess');
    services = require('../../server/services/services').getServicesFromDataSource(persistentData);
    service = services.registerService;
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

test('get_registered_user_returns_user', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});

// Negative test

test('register_existing_user_throws_already_taken', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('register_new_user_returns_okay', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('register_with_null_username_throws_bad_request_error', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('register_with_null_password_throws_bad_request_error', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('register_with_null_email_returns_user', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});