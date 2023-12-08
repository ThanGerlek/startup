'use strict';

import {cancelWaitNotification, clearMessageDisplay, displayMessage, setupWaitNotification} from "./message-display.js";
import {Board} from "./board.mjs";

import {getSocketConnection} from "./wsClient.mjs";

// don't initialize until page load
let socket = null;
let clientGame = null;

function onLoad() {
    socket = getSocketConnection();
    setUpGame();
}

function onSubmitButtonClick() {
    console.log(`Submit button was clicked.`);
    clearMessageDisplay();
    if (clientGame.gameType() !== 'local' && !clientGame.isPlayerTurn()) {
        displayMessage('error', "It's not your turn!");
        return;
    }
    clientGame.submitMove();
    if (clientGame.isGameOver()) {
        if (clientGame.isPlayerTurn()) {
            playerWin();
        } else {
            opponentWin();
        }
    } else {
        updateCurrentPlayerText();
    }
}

function onResetButtonClick() {
    console.log(`Reset button was clicked.`);
    clearMessageDisplay();
    clientGame.resetMove();
}

function setUpGame() {
    console.log('Setting up Game');

    const gameJson = localStorage.getItem('game');
    if (!gameJson) {
        throw new Error("Could not find gameData in localStorage");
    }
    const gameData = JSON.parse(gameJson);

    let boardContainerElement = document.getElementById('board-container');
    boardContainerElement.textContent = '';

    clientGame = new ClientGame(boardContainerElement, gameData);

    updateCurrentPlayerText();
}

function opponentWin() {
    console.log('Opponent win');
    window.location.href = 'you-lose.html';
    // TODO db: update player stats (on win or loss)
}

function playerWin() {
    console.log('Player win');
    window.location.href = 'you-win.html';
}

async function submitMoveToServer(gameData) {
    if (gameData.gameType === 'local') {
        return;
    }

    clearMessageDisplay();
    setupWaitNotification(1000);

    localStorage.setItem('game', JSON.stringify(gameData));

    let username = localStorage.getItem('username');
    let opponentUsername = localStorage.getItem('opponentUsername');

    try {
        let response = await getSubmitMoveResponse(gameData, username, opponentUsername);
        cancelWaitNotification();
        parseSubmitMoveResponse(response);
    } catch (err) {
        cancelWaitNotification();
        let msg = `Failed to connect to the server. Make sure you're connected to the internet, or try again later.`;
        displayMessage('error', msg);
        // TODO. err: handle by ending game or trying to reconnect?
    }
}

async function getSubmitMoveResponse(gameData, username, opponentUsername) {
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
    console.log(`Changing turn`);
    clientGame.changeTurn();
    updateCurrentPlayerText();
}

function isInvalidUserResponse(response) {
    return response.value === 'error' && response.errorType === 'invalidUser'; // temporary artificial implementation
}

function isOKResponse(response) {
    return response.value === '200 OK'; // temporary artificial implementation
}

function updateCurrentPlayerText() {
    document.getElementById('current-turn-username-box').textContent = clientGame.getCurrentPlayer();
}

class ClientGame {
    #gameType;
    #playerUsername;
    #opponentUsername;
    #isPlayerTurn;

    #gameBoard;
    #localBoard;

    #rowBeingEdited;

    constructor(boardContainerElement, gameData) {
        this.#gameType = gameData.gameType;
        this.#playerUsername = gameData.playerUsername;
        this.#opponentUsername = gameData.opponentUsername;
        this.#isPlayerTurn = gameData.isPlayerTurn;

        this.#gameBoard = new Board(gameData.board, null); // TODO? style: Replace 1-param constructor with a subclass of Board
        this.#localBoard = new Board(gameData.board, boardContainerElement);

        this.#rowBeingEdited = null;
    }

    gameType() {
        return this.#gameType;
    }

    isPlayerTurn() {
        return this.#isPlayerTurn;
    }

    getCurrentPlayer() {
        return this.#isPlayerTurn ? this.#playerUsername : this.#opponentUsername;
    }

    changeTurn() {
        this.#isPlayerTurn = !this.#isPlayerTurn;
    }

    isGameOver() {
        return this.#gameBoard.numPiecesLeft() === 0;
    }

    submitMove() {
        // Check valid move (at least one piece must have been taken)
        if (this.checkForValidMove()) {
            this.#gameBoard.copyStateFrom(this.#localBoard);
            submitMoveToServer(this.getGameData()); // TODO add .then() to change turn locally
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

    getGameData() {
        return {
            playerUsername: this.#playerUsername,
            opponentUsername: this.#opponentUsername,
            isPlayerTurn: this.#isPlayerTurn,
            board: this.#gameBoard.toArray(),
            gameType: this.#gameType,
        };
    }
}


document.addEventListener('DOMContentLoaded', onLoad);
document.getElementById('submit-board-button').addEventListener('click', onSubmitButtonClick);
document.getElementById('reset-board-button').addEventListener('click', onResetButtonClick);
