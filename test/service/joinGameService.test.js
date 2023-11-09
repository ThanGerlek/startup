'use strict';

const request = require('supertest');
const app = require('../../server');

const {GameDAO, GameRequestDAO, UserDAO} = require('../../server/dataAccess/dataAccess');
const {Game} = require('../../server/models');
const {JoinGameService} = require('../../server/services/services');
const {JoinGameRequest} = require('../../server/http');

let gameDAO;
let gameRequestDAO;
let userDAO;

let service;

beforeEach(() => {
    gameDAO = new GameDAO();
    gameRequestDAO = new GameRequestDAO();
    userDAO = new UserDAO();

    service = new JoinGameService(gameDAO, gameRequestDAO, userDAO);
});


test('invalid URL returns 404', (done) => {
    request(app)
        .put('/thing')
        .send({msg: 'an invalid request'})
        .expect(404)
        .expect({})
        .end((err) => err ? done(err) : done());
});

/*
join w/ no game, no request: create game
join w/ no game, request: delete request, start new game, join game
join w/ game, no request (lost connection): get game state, join game
join w/ game, request (undefined behavior?): same as lost connection


join with invalid first player
join with invalid second player
join with same first and second player


*/

// invalid requests

test('join with invalid first player throws bad request error', (done) => {
    // TODO
});


test('join with invalid second player throws bad request error', (done) => {
    // TODO
});


test('join with same first and second player throws bad request error', (done) => {
    // TODO
});


// no existing game or request

test('no existing game or request: find request returns request', (done) => {
    // TODO
});


test('no existing game or request: find game does NOT return game', (done) => {
    // TODO
});


// existing request (no existing game)

test('existing request (no existing game): find request does NOT return request', (done) => {
    // TODO
});


test('existing request (no existing game): find game returns new game', (done) => {
    // TODO
});


test('existing request (no existing game): game usernames are correct', (done) => {
    // TODO
});


test('existing request (no existing game): swapping players changes who goes first', (done) => {
    // TODO
});


// existing game (no existing request)

test('existing game (no existing request): find request does NOT return request', (done) => {
    // TODO
});


test('existing game (no existing request): find game returns EXISTING game', (done) => {
    // TODO
});


test('existing game (no existing request): game usernames are correct', (done) => {
    // TODO
});


test('existing game (no existing request): swapping players changes who goes first', (done) => {
    // TODO
});


// existing game and request

test('existing game and request: find request does NOT return request', (done) => {
    // TODO
});


test('existing game and request: find game returns EXISTING game', (done) => {
    // TODO
});


test('existing game and request: game usernames are correct', (done) => {
    // TODO
});


test('existing game and request: swapping players changes who goes first', (done) => {
    // TODO
});