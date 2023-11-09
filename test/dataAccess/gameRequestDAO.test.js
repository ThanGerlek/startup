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


test('insertNewGameDoesNotError', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// findGame positive test
test('find_inserted_game_returns_nonnull', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// insertNewGame negative test
test('insert_game_twice_with_same_gameID_throws_error', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// insertNewGame positive test
test('findReturnsGameWithEqualBoard', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('findReturnsGameWithSameGameID', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('findReturnsGameWithSameGameName', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('findReturnsGameWithSamePlayers', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('findReturnsGameWithSameNumberOfSpectators', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// findGame negative test
test('findNonexistentGameErrors', () => {
    throw new Error("Unimplemented test!"); // TODO test
});


// removeGame positive test
test('findRemovedGameErrors', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// removeGame "negative" test
test('removeNonexistentGameDoesNotThrow', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// updateGameState positive test
test('updateGameState_changes_board_state', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// updateGameState negative test
test('updateGameState_of_nonexistent_game_throws_error', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// clearGames positive test
test('findClearedGamesErrors', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// clearGames "negative" test
test('clearEmptyDoesNotThrow', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// generateNewGameID positive test
test('generateTwoGameIDsReturnsDifferentValues', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});