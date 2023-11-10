const DEFAULT_BOARD_DIMENSIONS = [1, 3, 5, 7];

import {cancelWaitNotification, clearMessageDisplay, displayMessage, setupWaitNotification} from "./message-display.js";

// TODO. Add persistence across page reloads
// Store the actual board state in localStorage, and deserialize into window.game upon page load?

function onLoad() {
    //TODO server: test for server connection?
    silentAuthenticateToken(); // TODO convert to use .then()
    setUpGame();
}

function onSubmitButtonClick() {
    console.log(`Submit button was clicked.`);
    let game = getGame();
    game.submitMove();
    if (game.isGameOver()) {
        opponentWin();
    }
    
    temp_testPlayerWin();
}

function temp_testPlayerWin() {
    // TODO server: remove temp_testPlayerWin() and Game.temp_isGameOverForOpponent()
    let game = getGame();
    if (game.temp_isGameOverForOpponent()) {
        playerWin();
    }
}

function onResetButtonClick() {
    console.log(`Reset button was clicked.`);
    clearMessageDisplay();
    getGame().resetMove();
}

function setUpGame() {
    console.log('Setting up Game');

    let boardContainerElement = document.getElementById('board-container');
    boardContainerElement.textContent = '';

    let isPlayerTurn = initializePlayerTurn();
    window.game = new Game(boardContainerElement, DEFAULT_BOARD_DIMENSIONS, isPlayerTurn);
}

function initializePlayerTurn() {
    // TODO feat: allow choosing of who goes first
    let opponentName = localStorage.getItem('opponentUsername');
    if (!opponentName) { // TODO rmv test code
        opponentName = "Bob Ross";
    }
    let isPlayerTurn = false;
    document.getElementById('current-turn-username-box').textContent = opponentName;
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

function markElementTaken(element) {
    // TODO. css: Replace opacity with a bootstrap mask
    element.style.opacity = "0.5";
}

function markElementNotTaken(element) {
    element.style.opacity = "1.0";
}

function getGame() {
    let game = window.game;
    if (!game) {
        throw new Error('Failed to get Game object');
        // TODO? db: handle error? End game, or maybe re-query database?
    }
    return game;
}

async function submitMoveToServer(gameboard) {
    clearMessageDisplay();
    setupWaitNotification(1000);

    let username = localStorage.getItem('user');
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
            response = {value: 'blue', errorType: 'french fries',  token: {tokenString: 'ur face', username: 'abraham lincoln'}};
        }
        else if (username === "board_invalid-but-logged-in") {
            console.log('Test: simulating a "logged in" user with an invalid username (account removed during gameplay?)');
            response = new ErrorResponse('invalidUser');
        }
        else if (username === "board_test-server-access-failure") {
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

    getTurnElement().textContent = localStorage.getItem(
        game.isPlayerTurn() ? 'user' : 'opponentUsername');

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

function constructGamepieceElement(onclickListener) {
    const gamepieceElement = document.createElement('input');
    gamepieceElement.type = "image";
    gamepieceElement.alt = "matchstick";
    gamepieceElement.height = 50;
    gamepieceElement.src = "img/150-750-matchstick.png";
    gamepieceElement.className = "px-2";

    gamepieceElement.addEventListener('click', onclickListener);

    return gamepieceElement;
}

function constructRowContainerElement() {
    const rowContainerElement = document.createElement('div');
    rowContainerElement.className = "container py-2 d-flex justify-content-around";
    return rowContainerElement;
}

class Gamepiece {
    #taken = false;
    #gamepieceElement;

    constructor(gamepieceElement) {
        if (gamepieceElement) {
            this.#gamepieceElement = gamepieceElement;
            markElementNotTaken(gamepieceElement);
            gamepieceElement.addEventListener('click', () => this.toggleIsTaken());
        } else {
            this.#gamepieceElement = null;
        }
    }

    isTaken() {return this.#taken;}

    toggleIsTaken() {
        this.setIsTaken(!this.isTaken());
    }

    setIsTaken(taken) {
        this.#taken = taken;
        this.updateElement();

    }

    updateElement() {
        if (this.#gamepieceElement) {
            if (this.isTaken()) {
                markElementTaken(this.#gamepieceElement);
            } else {
                markElementNotTaken(this.#gamepieceElement);
            }
        }
    }
}

class Row {
    #pieces;
    #size;
    #rowContainerElement;

    constructor(size, rowContainerElement) {
        this.#pieces = [];
        this.#size = size;
        this.#rowContainerElement = rowContainerElement;

        for (let i = 0; i < size; i++) {
            this.addNewGamepiece();
        }
    }

    size() {return this.#size;}

    isTaken(pieceIndex) {
        return this.#pieces[pieceIndex].isTaken();
    }

    markTaken(pieceIndex) {
        let piece = this.#pieces[pieceIndex];
        if (!piece.isTaken()) {
            piece.setIsTaken(true);
        }
    }

    numPiecesLeft() {
        let numLeft = 0;
        for (let i = 0; i < this.#size; i++) {
            if (!this.isTaken(i)) {
                numLeft++;
            }
        }
        return numLeft;
    }

    addNewGamepiece() {
        let gamepieceElement = null;
        if (this.#rowContainerElement) {
            gamepieceElement = constructGamepieceElement();
            this.#rowContainerElement.appendChild(gamepieceElement);
        }
        this.#pieces.push(new Gamepiece(gamepieceElement));
    }

    copyStateFrom(otherRow) {
        if (this.size() !== otherRow.size()) {
            throw new Error("Mismatched row sizes when calling row.copyStateFrom()");
        }
        for (let i = 0; i < this.size() && i < otherRow.size(); i++) {
            let isTaken = otherRow.isTaken(i);
            this.#pieces[i].setIsTaken(isTaken);
        }
    }
}

class Board {
    #rows;
    #boardContainerElement;

    constructor(boardDimensions, boardContainerElement) {
        this.#rows = [];
        this.#boardContainerElement = boardContainerElement;

        let numRows = boardDimensions.length;
        for (let i = 0; i < numRows; i++) {
            let rowSize = boardDimensions[i];
            this.addNewRow(rowSize);
        }
    }

    numPiecesLeft() {
        let numLeft = 0;
        for (let i = 0; i < this.#rows.length; i++) {
            numLeft += this.#rows[i].numPiecesLeft();
        }
        return numLeft;
    }

    isTaken(rowIndex, pieceIndex) {
        return this.#rows[rowIndex].isTaken(pieceIndex);
    }

    addNewRow(rowSize) {
        let rowContainerElement = null;
        if (this.#boardContainerElement) {
            rowContainerElement = constructRowContainerElement();
            this.#boardContainerElement.appendChild(rowContainerElement);
        }
        this.#rows.push(new Row(rowSize, rowContainerElement));
    }

    copyStateFrom(otherBoard) {
        for (let rowIndex = 0; rowIndex < this.#rows.length; rowIndex++) {
            this.#rows[rowIndex].copyStateFrom(otherBoard.#rows[rowIndex]);
        }
    }

    compareRows(otherBoard) {
        let rowDiffs = [];
        for (let i = 0; i < this.#rows.length; i++) {
            let rowDiff = this.#rows[i].numPiecesLeft() - otherBoard.#rows[i].numPiecesLeft();
            rowDiffs.push(rowDiff);
        }
        return rowDiffs;
    }
}

class Game {
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
        if(this.checkForValidMove()) {
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
