'use strict';

const request = require('supertest');
const app = require('../../server');

const dataAccess = require('../../server/dataAccess/dataAccess');
const models = require('../../server/models');
const services = require('../../server/services/services');

let gameDAO;
let gameRequestDAO;
let userDAO;

let service;

beforeEach(() => {
    gameDAO = new dataAccess.GameDAO();
    gameRequestDAO = new dataAccess.GameRequestDAO();
    userDAO = new dataAccess.UserDAO();

    service = new services.JoinGameService(gameDAO, gameRequestDAO, userDAO);
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
test('find_created_Game_returns_Game', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// Negative test
test('create_Game_with_invalid_token_returns_forbidden', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('create_Game_returns_okay', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// Positive test
test('join_Game_as_white_adds_user_as_white', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('join_Game_as_black_adds_user_as_black', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


// Negative test
test('join_nonexistent_Game_returns_bad_request_error', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('join_Game_returns_okay', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('join_Game_without_color_returns_okay', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('join_Game_with_already_taken_color_returns_taken', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});


test('join_Game_with_invalid_token_errors', (done) => {
    throw new Error("Unimplemented test!"); // TODO test
});