const DEFAULT_BOARD_DIMENSIONS = [1, 3, 5, 7];

import { setupWaitNotification, cancelWaitNotification, displayMessage, clearMessageDisplay } from "./message-display.js";

function onLoad() {
    //TODO test for server connection?
    silentAuthenticateToken();
    setUpGame();
}

function onSubmitButtonClick() {
    console.log(`Submit button was clicked.`);
}

function onResetButtonClick() {
    console.log(`Reset button was clicked.`);
    // TODO
}

function onPieceClick(rowIndex, pieceIndex) {
    console.log(`Piece in row ${rowIndex}, index ${pieceIndex} was clicked.`);
    // TODO
}

function setUpGame() {
    console.log('Setting up Game');
    let isPlayerTurn = true;
    let boardContainerElement = document.getElementById('board-container');
    let game = new Game(isPlayerTurn, boardContainerElement, DEFAULT_BOARD_DIMENSIONS);
}

function opponentWin() {
    // TODO
    console.log('Opponent win');
}

function playerWin() {
    // TODO
    console.log('Player win');
}

// TODO? Write code to dynamically generate board HTML?
function getPieceElement(rowIndex, pieceIndex) {
    let id = `gamepiece-element-${rowIndex}-${pieceIndex}`;
    return document.getElementById('gamepiece-element-')
}

class Gamepiece {
    #taken = false;

    isTaken() {return this.#taken;}

    take() {
        if (this.taken) {
            throw new Error("Tried to mark a piece as taken that was already taken");
        } else {
        this.#taken = true;
        }
    }
}

class Row {
    #pieces;
    #size;
    #numPiecesLeft;
    constructor(size) {
        this.#size = size;
        this.#numPiecesLeft = size;

        this.#pieces = [];
        for (let i = 0; i < size; i++) {
            this.#pieces[i] = new Gamepiece();
        }
    }

    size() {return this.#size;}

    isTaken(pieceIndex) {
        return this.#pieces[pieceIndex].isTaken();
    }

    markTaken(pieceIndex) {
        let piece = this.#pieces[pieceIndex];
        if (piece.isTaken()) {
            piece.take();
            this.#numPiecesLeft--;
        }
    }

    copyStateFrom(otherRow) {
        if (this.size() != otherRow.size()) {
            throw new Error("Mismatched row sizes when calling row.copyStateFrom()");
        }
        this.#pieces = [];
        for (let i = 0; i < this.size() && i < otherRow.size(); i++) {
            this.#pieces[i] = new Gamepiece();
            if (otherRow.isPieceTaken(i)) {
                this.#pieces[i].take();
            }
        }
    }
}

class Board {
    #rows;

    constructor(boardDimensions) {
        this.#rows = [];

        let numRows = boardDimensions.length;
        for (let i = 0; i < numRows; i++) {
            let rowSize = boardDimensions[i];
            this.#rows[i] = new Row(rowSize);
        }
    }

    numPiecesLeft() {
        let numLeft = 0;
        for (row in rows) {
            numLeft += row.numPiecesLeft();
        }
        return numLeft;
    }

    isTaken(rowIndex, pieceIndex) {
        return rows[rowIndex].isTaken(pieceIndex);
    }

    markTaken(rowIndex, pieceIndex) {
        rows[rowIndex].markTaken(pieceIndex);
    }

    copyStateFrom(otherBoard) {
        for (let rowIndex = 0; rowIndex < this.#rows.length; rowIndex++) {
            rows[rowIndex].copyStateFrom(otherBoard.#rows[rowIndex]);
        }
    }
}

class BoardDisplay extends Board {
    constructor(boardContainerElement, boardDimensions) {
        if (boardContainerElement == undefined || boardDimensions == undefined) {
            throw new Error("Argument Error: Tried to construct a BoardDisplay with only one parameter (did something think it was a Board?)");
        }
        super(boardDimensions);
    }

    // TODO Override Board methods
}

class Game {
    #isPlayerTurn;
    #gameBoard;
    #localBoard;
    #rowBeingEdited;

    constructor(isPlayerTurn, boardContainerElement, boardDimensions) {
        this.#isPlayerTurn = isPlayerTurn;
        this.#gameBoard = new Board(boardDimensions);
        this.#localBoard = new BoardDisplay(boardContainerElement, boardDimensions);
        this.#rowBeingEdited = null;

        this.#addPieceClickEvents();
    }

    #addPieceClickEvents() {
        // TODO dynamically add click events, rather than hardcode into HTML
    }

    isGameOver() {
        return this.#gameBoard.numPiecesLeft() == 0;
    }

    takePiece(rowIndex, pieceIndex) {
        // TODO test if valid (this piece is already taken, piece in a different row also selected, etc.)
                this.#localBoard.markTaken(rowIndex, pieceIndex);
    }

    submitMove() {
        this.#gameBoard.copyStateFrom(this.#localBoard);
        // TODO send move to server
    }

    resetMove() {
        this.#localBoard.copyStateFrom(this.#gameBoard);
    }
}


document.addEventListener('DOMContentLoaded', onLoad);
document.getElementById('submit-board-button').addEventListener('click', () => onSubmitButtonClick());
document.getElementById('reset-board-button').addEventListener('click', () => onResetButtonClick());
