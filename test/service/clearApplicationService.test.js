'use strict';

const request = require('supertest');
const app = require('../../server');

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
    throw new Error("Unimplemented test!"); // TODO test
});


test('clearing_returns_okay', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('clearing_empty_returns_okay', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
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
