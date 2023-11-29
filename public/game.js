'use strict';

import {cancelWaitNotification, clearMessageDisplay, displayMessage, setupWaitNotification} from "./message-display.js";
import {Board, DEFAULT_BOARD_DIMENSIONS} from "./board.mjs";

// TODO. Add persistence across page reloads
// Store the actual board state in localStorage, and deserialize into window.game upon page load?

function onLoad() {
    //TODO server: test for server connection?
    setUpGame();
}

function onSubmitButtonClick() {
    console.log(`Submit button was clicked.`);
    window.game.submitMove();
    if (window.game.isGameOver()) {
        opponentWin();
    }

    temp_testPlayerWin();
}

function temp_testPlayerWin() {
    // TODO server: remove temp_testPlayerWin() and Game.temp_isGameOverForOpponent()
    if (window.game.temp_isGameOverForOpponent()) {
        playerWin();
    }
}

function onResetButtonClick() {
    console.log(`Reset button was clicked.`);
    clearMessageDisplay();
    window.game.resetMove();
}

function setUpGame() {
    console.log('Setting up Game');

    let boardContainerElement = document.getElementById('board-container');
    boardContainerElement.textContent = '';

    let isPlayerTurn = initializePlayerTurn();
    window.game = new ClientGame(boardContainerElement, DEFAULT_BOARD_DIMENSIONS, isPlayerTurn);
}

function initializePlayerTurn() {
    const firstPlayer = window.game.firstPlayer();
    const secondPlayer = window.game.secondPlayer();
    const isFirstPlayerTurn = window.game.isFirstPlayerTurn();

    const playerUsername = localStorage.getItem('username');
    const opponentUsername = (firstPlayer === playerUsername) ? secondPlayer : firstPlayer;

    const isPlayerTurn = (firstPlayer === playerUsername) && isFirstPlayerTurn;

    document.getElementById('current-turn-username-box').textContent = isPlayerTurn ? playerUsername : opponentUsername;

    return isPlayerTurn;
}

function opponentWin() {
    console.log('Opponent win');
    // TODO ws: close connection? (on win or loss)
    window.location.href = 'you-lose.html';
    // TODO db: update player stats (on win or loss)
}

function playerWin() {
    console.log('Player win');
    window.location.href = 'you-win.html';
}

async function submitMoveToServer(gameboard) {
    // TODO ws
    clearMessageDisplay();
    setupWaitNotification(1000);

    let username = localStorage.getItem('username');
    let opponentUsername = localStorage.getItem('opponentUsername');

    try {
        let response = await getSubmitMoveResponse(gameboard, username, opponentUsername);
        cancelWaitNotification();
        parseSubmitMoveResponse(response);
    } catch (err) {
        cancelWaitNotification();
        let msg = `Failed to connect to the server. Make sure you're connected to the internet, or try again later.`;
        displayMessage('error', msg);
        // TODO. err: handle by ending game or trying to reconnect?
    }
}

async function getSubmitMoveResponse(gameboard, username, opponentUsername) {
    // Return artificial data

    return new Promise((resolve, reject) => {
        console.log(`Simulating accessing server to submit move. User: '${username}', opponent: '${opponentUsername}'`);

        let response = {};

        if (username === opponentUsername) {
            response = new ErrorResponse('invalidUser');
        } else {
            response = new OKResponse();
        }


        // TODO server: remove test code
        if (username === "board_test-bad-response") {
            console.log('Test: simulating receiving a malformed response');
            response = {
                value: 'blue', errorType: 'french fries', token: {tokenString: 'ur face', username: 'abraham lincoln'}
            };
        } else if (username === "board_invalid-but-logged-in") {
            console.log('Test: simulating a "logged in" user with an invalid username (account removed during gameplay?)');
            response = new ErrorResponse('invalidUser');
        } else if (username === "board_test-server-access-failure") {
            console.log('Test: simulating a server access failure');
            reject();
        }

        setTimeout(() => resolve(response), 2000);
        // resolve(response);
    });
}

function parseSubmitMoveResponse(response) {
    if (isOKResponse(response)) {
        clearMessageDisplay();
        changeTurn();
    } else if (isInvalidUserResponse(response)) {
        displayMessage('error', 'Woah! Invalid username! Try restarting the game.');
        // TODO. err: handle by ending game?
    } else {
        displayMessage('error', 'Failed to parse HTTP response! Please try again.');
    }
}

function changeTurn() {
    console.log(`Move submitted. Changing turn`);
    window.game.changeTurn();

    getTurnElement().textContent = localStorage.getItem(game.isPlayerTurn() ? 'username' : 'opponentUsername');

    console.log(`[Not actually changing turn, since the database isn't implemented yet]`);
    //TODO. js: Actually change turns, with all the functional restrictions that entails; then when the user clicks submit again, change back to their turn without marking anything.
}

function isInvalidUserResponse(response) {
    return response.value === 'error' && response.errorType === 'invalidUser'; // temporary artificial implementation
}

function isOKResponse(response) {
    return response.value === '200 OK'; // temporary artificial implementation
}

function getTurnElement() {
    return document.getElementById('current-turn-username-box');
}

class ClientGame {
    #isPlayerTurn;
    #gameBoard;
    #localBoard;
    #rowBeingEdited;

    constructor(boardContainerElement, boardDimensions, isPlayerTurn) {
        this.#isPlayerTurn = isPlayerTurn;
        this.#gameBoard = new Board(boardDimensions, null); // TODO? style: Replace 1-param constructor with a subclass of Board
        this.#localBoard = new Board(boardDimensions, boardContainerElement);
        this.#rowBeingEdited = null;
    }

    isPlayerTurn() {
        return this.#isPlayerTurn;
    }

    changeTurn() {
        this.#isPlayerTurn = !this.#isPlayerTurn;
    }

    isGameOver() {
        return this.#gameBoard.numPiecesLeft() === 0;
    }

    temp_isGameOverForOpponent() {
        return this.#gameBoard.numPiecesLeft() === 1;
    }

    submitMove() {
        // Check valid move (at least one piece must have been taken)
        if (this.checkForValidMove()) {
            this.#gameBoard.copyStateFrom(this.#localBoard);
            submitMoveToServer(this.#gameBoard); // TODO add .then() to change turn locally
        } else {
            displayMessage('warn', 'Invalid move! You must select at least one match, and they all must be from the same row.');
            this.resetMove();
        }
    }

    resetMove() {
        this.#localBoard.copyStateFrom(this.#gameBoard);
    }

    checkForValidMove() {
        let rowDiffs = this.#gameBoard.compareRows(this.#localBoard);
        let numEditedRows = 0;
        for (let i = 0; i < rowDiffs.length; i++) {
            if (rowDiffs[i] > 0) {
                numEditedRows++;
            } else if (rowDiffs[i] < 0) {
                console.log('Un-took pieces that were taken in a previous move (without preserving the row total)');
                return false;
            }
        }

        return numEditedRows === 1;
    }
}


document.addEventListener('DOMContentLoaded', onLoad);
document.getElementById('submit-board-button').addEventListener('click', () => onSubmitButtonClick());
document.getElementById('reset-board-button').addEventListener('click', () => onResetButtonClick());
