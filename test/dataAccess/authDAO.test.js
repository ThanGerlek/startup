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


test('addAuthTokenDoesNotError', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('addAuthTokenNonexistentUserErrors', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// addAuthToken negative test
test('addSameTokenTwiceErrors', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('addDifferentTokenStringSameUserDoesNotError', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// addAuthToken positive test
// isValidToken positive test
test('addedTokenIsValid', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// isValidToken negative test
test('nonexistentTokenIsNotValid', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// removeAuthToken positive test
test('removedTokenIsNotValid', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// removeAuthToken "negative" test
test('removingNonexistentTokenDoesNotThrow', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// clearAuthTokens positive test
test('clearedAuthTokensAreInvalid', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// getUsername positive test 
test('getUsernameReturnsUsername', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// getUsername negative test
test('getUsernameOfInvalidTokenErrors', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});