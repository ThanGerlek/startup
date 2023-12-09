'use strict';

import {clearMessageDisplay, displayMessage} from "./message-display.js";
import {Board} from "./board.mjs";

import {getSocketConnection, setLoadGameCallback} from "./wsClient.mjs";

// don't initialize until page load
let socket = null;
let clientGame = null;

async function onLoad() {
    socket = await getSocketConnection();
    setLoadGameCallback(loadGame);
    setUpGame();
    registerUsername();
    createGameRequest(clientGame.getGameData());
    updateCurrentPlayerText();
}

function onSubmitButtonClick() {
    console.log(`Submit button was clicked.`);
    if (clientGame.gameType() !== 'local' && !clientGame.isPlayerTurn()) {
        displayMessage('error', "It's not your turn!");
        return;
    }
    clientGame.submitMove();

    localStorage.setItem('game', JSON.stringify(clientGame.getGameData()));
    if (clientGame.gameType() === 'remote') {
        submitMoveToServer(clientGame.getGameData());
    }

    updateVisuals();
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
    loadGame(gameData);
}

function loadGame(gameData) {
    console.log('Called loadGame');
    let boardContainerElement = document.getElementById('board-container');
    boardContainerElement.textContent = '';
    updateVisuals();

    clientGame = new ClientGame(boardContainerElement, gameData);
}

function registerUsername() {
    const message = {action: 'registerUsername', value: localStorage.getItem('username')};
    socket.send(JSON.stringify(message));
}

function createGameRequest(gameData) {
    const message = {action: 'createGame', value: gameData};
    socket.send(JSON.stringify(message));
}

function updateVisuals() {
    clearMessageDisplay();
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

function opponentWin() {
    console.log('Opponent win');
    window.location.href = 'you-lose.html';
    // TODO db: update player stats (on win or loss)
}

function playerWin() {
    console.log('Player win');
    window.location.href = 'you-win.html';
}

function submitMoveToServer() {
    const message = {'action': 'submitMove', 'value': clientGame.getGameData()};
    socket.send(JSON.stringify(message));
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
        this.#initUsernames(gameData);

        this.#gameBoard = new Board(gameData.board, null); // TODO? style: Replace 1-param constructor with a subclass of Board
        this.#localBoard = new Board(gameData.board, boardContainerElement);

        this.#rowBeingEdited = null;
    }

    #initUsernames(gameData) {
        this.#playerUsername = localStorage.getItem('username');
        this.#opponentUsername = (gameData.players[0] === this.#playerUsername) ? gameData.players[1] : gameData.players[0];
        this.#isPlayerTurn = gameData.currentPlayer === this.#playerUsername;
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
            this.changeTurn();
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
            players: [this.#playerUsername, this.#opponentUsername],
            currentPlayer: this.getCurrentPlayer(),
            board: this.#gameBoard.toArray(),
            gameType: this.#gameType,
        };
    }
}


document.addEventListener('DOMContentLoaded', onLoad);
document.getElementById('submit-board-button').addEventListener('click', onSubmitButtonClick);
document.getElementById('reset-board-button').addEventListener('click', onResetButtonClick);
