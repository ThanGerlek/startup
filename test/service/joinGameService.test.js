'use strict';

const request = require('supertest');
const app = require('../../server');

const {GameDAO, GameRequestDAO, UserDAO, BadRequestError, NoSuchItemError} = require('../../server/dataAccess/dataAccess');
const {Game, Board} = require('../../server/models');
const {JoinGameService} = require('../../server/services/services');
const {JoinGameRequest} = require('../../server/http');

let gameDAO;
let gameRequestDAO;
let userDAO;

let service;

// TODO! Add all the nim-specific tests!

const firstJoinGameRequest = new JoinGameRequest("user1", "user2");
const secondJoinGameRequest = new JoinGameRequest("user2", "user1");
let game = new Game(1, "user1", "user2");
game.updateBoard(new Board().markTaken(0, 0));

beforeEach(() => {
    gameDAO = new GameDAO();
    gameRequestDAO = new GameRequestDAO();
    userDAO = new UserDAO();

    userDAO.insertNewUser("user1", "pass1");
    userDAO.insertNewUser("user2", "pass2");

    service = new JoinGameService(gameDAO, gameRequestDAO, userDAO);
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

test('join with invalid first player throws bad request error', () => {
    expect(() => service.joinGame(new JoinGameRequest("iDoNotExist", "user2"))).toThrow(BadRequestError);
});


test('join with invalid second player throws bad request error', () => {
    expect(() => service.joinGame(new JoinGameRequest("user1", "iDoNotExist"))).toThrow(BadRequestError);
});


test('join with same first and second player throws bad request error', () => {
    expect(() => service.joinGame(new JoinGameRequest("user1", "user1"))).toThrow(BadRequestError);
});


// no existing game or request

test('no existing game or request: find request returns request', () => {
    service.joinGame(firstJoinGameRequest);
    expect(gameRequestDAO.hasGameRequest("user1", "user2")).toBe(true);
});


test('no existing game or request: find game does NOT return game', () => {
    service.joinGame(firstJoinGameRequest);
    expect(gameDAO.findGameID("user1", "user2")).toThrow(NoSuchItemError);
});


// existing request (no existing game)

test('existing request (no existing game): find request does NOT return request', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    expect(gameRequestDAO.hasGameRequest("user1", "user2")).toBe(false);
});


test('existing request (no existing game): find game does not throw', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    expect(gameDAO.findGameID("user1", "user2")).not.toThrow(NoSuchItemError);
});


test('existing request (no existing game): find game returns game with new board', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    const gameID = gameDAO.findGameID("user1", "user2");
    expect(gameDAO.findGame(gameID).getBoard()).toBe(new Board());
});


test('existing request (no existing game): game usernames are correct', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    const gameID = gameDAO.findGameID("user1", "user2");
    expect(gameDAO.findGame(gameID).getUsernames()).toBe(["user1", "user2"]);
});


test('existing request (no existing game): first player has first turn', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    const gameID = gameDAO.findGameID("user1", "user2");
    expect(gameDAO.findGame(gameID).playerTurn()).toBe("user1");
});


// existing game (no existing request)

test('existing game (no existing request): find request does NOT return request', () => {
    // TODO
});


test('existing game (no existing request): find game returns EXISTING game', () => {
    // TODO
});


test('existing game (no existing request): game usernames are correct', () => {
    // TODO
});


test('existing game (no existing request): swapping players changes who goes first', () => {
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