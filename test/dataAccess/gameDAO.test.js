'use strict';

import {
    GameDAO, UserDAO, NoSuchItemError, ValueAlreadyTakenError, BadRequestError
} from '../../server/dataAccess/dataAccess';
import {Game, User} from '../../server/models';
import {Board, DEFAULT_BOARD_DIMENSIONS} from '../board';

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

beforeEach(() => {
    gameDAO = new GameDAO();
    userDAO = new UserDAO();
    userDAO.insertNewUser(user1);
    userDAO.insertNewUser(user2);
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


test('find after updateGameState with toggleTurn=true returns game with opposite turn status', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    gameDAO.updateGameState('user1', 'user2', board2, true);

    const fetchedTurnStatus = gameDAO.findGame('user1', 'user2').isFirstPlayerTurn();
    const expectedTurnStatus = !game1.isFirstPlayerTurn();

    expect(fetchedTurnStatus).isFirstPlayerTurn().toBe(expectedTurnStatus);
});


test('find after updateGameState with toggleTurn=false returns game with same turn status', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    gameDAO.updateGameState('user1', 'user2', board2, false);

    const fetchedTurnStatus = gameDAO.findGame('user1', 'user2').isFirstPlayerTurn();
    const expectedTurnStatus = game1.isFirstPlayerTurn();

    expect(fetchedTurnStatus).isFirstPlayerTurn().toBe(expectedTurnStatus);
});


test('find after updateGameState without toggleTurn parameter returns game with same turn status', () => {
    gameDAO.insertGame('user1', 'user2', game1);
    gameDAO.updateGameState('user1', 'user2', board2);

    const fetchedTurnStatus = gameDAO.findGame('user1', 'user2').isFirstPlayerTurn();
    const expectedTurnStatus = game1.isFirstPlayerTurn();

    expect(fetchedTurnStatus).isFirstPlayerTurn().toBe(expectedTurnStatus);
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