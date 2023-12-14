import React from 'react';
import {Navigate} from "react-router-dom";
import {clearMessageDisplay, displayMessage} from "../general/message-display.js";
import {Board} from "./board.mjs";
import {getSocketConnection, setLoadGameCallback} from "../general/wsClient.mjs";

let socket = null;
let clientGame = null;

let playerWin = function () {
    throw new Error("Called playerWin() before it was defined");
};

let opponentWin = function () {
    throw new Error("Called opponentWin() before it was defined");
};

export function Game({gameData, playerUsername}) {

    const [winState, setWinState] = React.useState(null);

    playerWin = function () {
        console.log('player win');
        setWinState('player');
    }
    opponentWin = function () {
        console.log('Opponent win');
        setWinState('opponent');
    }

    React.useEffect(() => {
        onLoad(gameData, playerUsername);
    }, [gameData, playerUsername]);


    if (winState) {
        // TODO db: update player stats (on win or loss)
        if (winState === 'player') {
            return <Navigate to={'/you-win'}/>;
        } else {
            return <Navigate to={'/you-lose'}/>;
        }
    } else {
        return <GameDisplay/>;
    }
}


function GameDisplay() {
    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-between align-items-center">
        {/* TODO. css: Shrink game buttons to better handle 150% size? Remove opponent name when they're too big? */}
        {/* TODO. html: Display "Make your move!" as a message, so there's always a box there, and replace with "waiting for opponent" when it's not the player's turn */}
        {/* TODO. css: Decide on turn highlighting */}

        {/* With back-and-forth highlighting */}

        <div className="container-fluid d-flex justify-content-between">
            <div className="btn btn-primary disabled">
                Make your move!
            </div>
            <div id="current-turn-username-box" className="btn btn-outline-primary disabled">
                George Washington
            </div>
        </div>

        {/*    ^^^ Player turn ^^^     VVV opponent turn VVV    */}

        {/* <div className="container-fluid d-flex justify-content-between">
                <div className="btn btn-outline-primary disabled">
                    Waiting for opponent
                </div>
                <div className="btn btn-primary disabled">
                    George Washington
                </div>
            </div> */}

        {/* With no adaptive highlighting */}

        {/* <div className="container-fluid d-flex justify-content-between">
                <div className="btn btn-outline-primary disabled">
                    Make your move!
                </div>
                <div className="btn btn-outline-primary disabled">
                    George Washington
                </div>
            </div> */}

        {/*    ^^^ Player turn ^^^     VVV opponent turn VVV    */}

        {/* <div className="container-fluid d-flex justify-content-between">
                <div className="btn btn-outline-primary disabled">
                    Waiting for opponent
                </div>
                <div className="btn btn-outline-primary disabled">
                    George Washington
                </div>
            </div> */}

        {/* end with */}


        <div className="container" id="board-container" style={{maxWidth: 400}}>
        </div>

        <div className="container-fluid d-flex justify-content-around">
            {/* TODO. css: Switch to check and reset icons */}
            <button type="button" id="submit-board-button" className="btn btn-success"
                    onClick={onSubmitButtonClick}>Submit
            </button>
            <button type="button" id="reset-board-button" className="btn btn-dark" onSubmit={onResetButtonClick}>Reset
            </button>
        </div>

        <div id="info_message" className="alert alert-info" style={{display: "none"}}></div>
        <div id="warn_message" className="alert alert-warning" style={{display: "none"}}></div>
        <div id="error_message" className="alert alert-danger" style={{display: "none"}}></div>

        {/* TODO? css: Change other pages to match mt-3? */}
        {/* TODO. css: Make GitHub link vertically aligned with name text. */}
    </main>);
}

async function onLoad(initialGameData, playerUsername) {
    socket = await getSocketConnection();
    setLoadGameCallback((gameData) => {
        loadGame(gameData, playerUsername);
        clearMessageDisplay();
        updateVisuals();
    });
    loadGame(initialGameData, playerUsername);
    registerUsername(playerUsername);
    createGameRequest(clientGame.getGameData());
    updateVisuals();
}

function onSubmitButtonClick() {
    console.log(`Submit button was clicked.`);
    clearMessageDisplay();
    if (clientGame.gameType() !== 'local' && !clientGame.isPlayerTurn()) {
        displayMessage('error', "It's not your turn!");
        return;
    }
    clientGame.submitMove();

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

function loadGame(gameData,playerUsername) {
    console.log('Called loadGame');
    let boardContainerElement = document.getElementById('board-container');
    boardContainerElement.textContent = '';
    clientGame = new ClientGame(boardContainerElement, gameData, playerUsername);
}

function registerUsername(playerUsername) {
    const message = {action: 'registerUsername', value: playerUsername};
    socket.send(JSON.stringify(message));
}

function createGameRequest(gameData) {
    const message = {action: 'createGame', value: gameData};
    socket.send(JSON.stringify(message));
}

function updateVisuals() {
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

    constructor(boardContainerElement, gameData, playerUsername) {
        this.#gameType = gameData.gameType;
        this.#initUsernames(gameData, playerUsername);

        this.#gameBoard = new Board(gameData.board, null); // TODO? style: Replace 1-param constructor with a subclass of Board
        this.#localBoard = new Board(gameData.board, boardContainerElement);

        this.#rowBeingEdited = null;
    }

    #initUsernames(gameData, playerUsername) {
        this.#playerUsername = playerUsername;
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
