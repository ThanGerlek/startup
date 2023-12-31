'use strict';

const {
    NoSuchItemError, ValueAlreadyTakenError, BadRequestError, DataAccessManager
} = require('../../server/dataAccess/dataAccess');
const {Game, User} = require('../../server/models');
const {Board, DEFAULT_BOARD_DIMENSIONS} = require('../board');
const {MongoClient} = require("mongodb");
const dbConfig = require("../../server/config.json").database;

let client;
let gameDAO;
let userDAO;
const user1 = new User('user1', 'pass1');
const user2 = new User('user2', 'pass2');

const board1 = new Board(DEFAULT_BOARD_DIMENSIONS, null);
const board2 = new Board(DEFAULT_BOARD_DIMENSIONS, null);
board1.markTaken(0, 0);
board2.markTaken(1, 1);

const game1 = new Game(board1);
const game2 = new Game(board2);
game2.toggleTurn();


beforeAll(async () => {
    client = new MongoClient(`mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.hostname}`);
    await client.connect();
    const dataAccessManager = new DataAccessManager(client.db(dbConfig.dbName));
    gameDAO = dataAccessManager.getGameDAO();
    userDAO = dataAccessManager.getUserDAO();
});

beforeEach(async () => {
    await gameDAO.clearGames();
    userDAO.insertNewUser(user1);
    userDAO.insertNewUser(user2);
});

afterAll(async () => {
    await gameDAO.clearGames();
    await userDAO.clearUsers();
    await client.close();
});


// test the test
test('board1 test variable and board2 test variable are not equal', () => {
    expect(board1).not.toBe(board2);
});

// test the test
test('board1 test variable is equal to itself', () => {
    expect(board1).toBe(board1);
});


test('insert valid game does not error', () => {
    expect(() => gameDAO.insertGame('user1', 'user2', game1)).not.toThrow();
});


test('insert game that already exists throws already taken error', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    expect(() => gameDAO.insertGame('user1', 'user2', game1)).toThrow(ValueAlreadyTakenError);
});


test('insert game with invalid first player throws bad request error', () => {
    expect(() => gameDAO.insertGame('iDoNotExist', 'user2', game1))
        .toThrow(BadRequestError);
});


test('insert game with invalid second player throws bad request error', () => {
    expect(() => gameDAO.insertGame('user1', 'iDoNotExist', game1))
        .toThrow(BadRequestError);
});


test('find inserted game returns game with equal board', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    expect(gameDAO.findGame('user1', 'user2')).toBe(board1);
});


test('find inserted game returns game with same turn status', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    expect(gameDAO.findGame('user1', 'user2').isFirstPlayerTurn())
        .toBe(game1.isFirstPlayerTurn());
});


test('find with players in the opposite order returns game with equal board', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    expect(gameDAO.findGame('user2', 'user1')).toBe(board1);
});


test('find with players in the opposite order returns game with same turn status', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    expect(gameDAO.findGame('user2', 'user1').isFirstPlayerTurn())
        .toBe(game1.isFirstPlayerTurn());
});


test('find nonexistent game throws no such item error', () => {
    expect(() => gameDAO.findGame('user1', 'user2')).toThrow(NoSuchItemError);
});


test('find removed game throws no such item error', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    gameDAO.removeGame('user1', 'user2');
    expect(() => gameDAO.findGame('user1', 'user2')).toThrow(NoSuchItemError);
});


test('remove nonexistent game does not throw no such item error', () => {
    expect(() => gameDAO.removeGame('user1', 'user2')).not.toThrow(NoSuchItemError);
});


test('remove with invalid first player throws bad request error', () => {
    expect(() => gameDAO.removeGame('iDoNotExist', 'user2')).toThrow(NoSuchItemError);
});


test('remove with invalid second player throws bad request error', () => {
    expect(() => gameDAO.removeGame('user1', 'iDoNotExist')).toThrow(NoSuchItemError);
});


test('find after updateGameState returns game with updated board', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    gameDAO.updateGameState('user1', 'user2', board2);
    const fetchedBoard = gameDAO.findGame('user1', 'user2').getBoard();
    expect(fetchedBoard).toBe(board2);
});


test('updateGameState of nonexistent game throws no such item error', () => {
    expect(() => gameDAO.updateGameState('user1', 'user2', board2))
        .toThrow(NoSuchItemError);
});


test('updateGameState of removed game throws no such item error', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    gameDAO.removeGame('user1', 'user2');
    expect(() => gameDAO.updateGameState('user1', 'user2', board2))
        .toThrow(NoSuchItemError);
});


test('find cleared games throws no such item error', () => {
    gameDAO.insertGame(game1);
    gameDAO.clearGames();
    expect(gameDAO.findGame('user1', 'user2')).toThrow(NoSuchItemError);
});


test('clear empty does not throw', () => {
    expect(() => gameDAO.clearGames()).not.toThrow();
});