'use strict';

const {Board, DEFAULT_BOARD_DIMENSIONS} = require('../board.js');

const {GameDAO, GameRequestDAO, UserDAO, BadRequestError, NoSuchItemError, DataAccessError} = require('../../server/dataAccess/dataAccess');
const {Game} = require('../../server/models');
const {JoinGameService} = require('../../server/services/services');
const {JoinGameRequest} = require('../../server/http');

let gameDAO;
let gameRequestDAO;
let userDAO;

let service;

// TODO! Add all the nim-specific tests!

const firstJoinGameRequest = new JoinGameRequest("user1", "user2");
const secondJoinGameRequest = new JoinGameRequest("user2", "user1");
const board = new Board(DEFAULT_BOARD_DIMENSIONS, null);
board.markTaken(0, 0);
let game = new Game(1, "user1", "user2", board);

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

test('test the test: game variable board and new Board() are different', () => {
    expect(game.getBoard()).not.toBe(new Board(DEFAULT_BOARD_DIMENSIONS, null));
});


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

test('joining with no existing game or request: find request returns request', () => {
    service.joinGame(firstJoinGameRequest);
    expect(gameRequestDAO.hasGameRequest("user1", "user2")).toBe(true);
});


test('joining with no existing game or request: find game does NOT return game', () => {
    service.joinGame(firstJoinGameRequest);
    expect(gameDAO.findGameID("user1", "user2")).toThrow(NoSuchItemError);
});


// existing request (no existing game)

test('joining with existing request (no existing game): join with same request twice does not remove request', () => {
    service.joinGame(new JoinGameRequest("user1", "user2"));
    service.joinGame(new JoinGameRequest("user1", "user2"));
    expect(() => gameRequestDAO.hasGameRequest("user1", "user2")).toBe(true);
});


test('joining with existing request (no existing game): join with same request twice does not create game', () => {
    service.joinGame(new JoinGameRequest("user1", "user2"));
    service.joinGame(new JoinGameRequest("user1", "user2"));
    expect(() => gameDAO.findGameID("user1", "user2")).toThrow(NoSuchItemError);
});

test('joining with existing request (no existing game): find request does NOT return request', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    expect(gameRequestDAO.hasGameRequest("user1", "user2")).toBe(false);
});


test('joining with existing request (no existing game): find game does not throw NoSuchItem', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    expect(gameDAO.findGameID("user1", "user2")).not.toThrow(NoSuchItemError);
});


test('joining with existing request (no existing game): find game returns game with new board', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    const gameID = gameDAO.findGameID("user1", "user2");
    expect(gameDAO.findGame(gameID).getBoard()).toBe(new Board());
});


test('joining with existing request (no existing game): game usernames are correct', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    const gameID = gameDAO.findGameID("user1", "user2");
    expect(gameDAO.findGame(gameID).getUsernames()).toBe(["user1", "user2"]);
});


test('joining with existing request (no existing game): first player has first turn', () => {
    gameRequestDAO.insertGameRequest("user1", "user2");

    service.joinGame(secondJoinGameRequest);

    const gameID = gameDAO.findGameID("user1", "user2");
    expect(gameDAO.findGame(gameID).playerTurn()).toBe("user1");
});


// existing game

test('player 1 re-joining existing game does not throw', () => {
    gameDAO.insertGame(game);

    expect(() => service.joinGame(new JoinGameRequest("user1", "user2"))).not.toThrow();
});


test('player 1 re-joining existing game does not throw', () => {
    gameDAO.insertGame(game);

    expect(() => service.joinGame(new JoinGameRequest("user2", "user1"))).not.toThrow();
});


test('re-joining existing game does not change board state', () => {
    gameDAO.insertGame(game);

    service.joinGame(new JoinGameRequest("user1", "user2"));

    expect(gameDAO.findGame(gameID)).toBe(game);
});
