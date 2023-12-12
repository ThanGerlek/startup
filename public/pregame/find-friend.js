'use strict';

import {displayMessage} from "../general/message-display.js";
import {DEFAULT_BOARD_DIMENSIONS} from "../game/board.mjs";

function onSubmitButtonClick() {
    let playerUsername = localStorage.getItem('username');
    let opponentUsername = document.getElementById('otherUsernameBox').value;

    if (opponentUsername === "") {
        displayMessage('warn', 'Please enter a username.');
    } else if (opponentUsername === playerUsername) {
        if (getGameType() === 'local') {
            displayMessage('warn', "Woah! That's your friend's name! Please try something else.");
        } else {
            displayMessage('warn', "Enter your opponent's username, not yours.");
        }
    } else {
        storeNewGame(playerUsername, opponentUsername);
        window.location.href = 'game.html';
    }
}

function storeNewGame(playerUsername, opponentUsername) {
    const gameData = {
        players: [playerUsername, opponentUsername],
        currentPlayer: playerUsername, // TODO allow switching who goes first
        board: generateNewBoardArray(),
        gameType: getGameType(),
    };
    localStorage.setItem('game', JSON.stringify(gameData));
}

function generateNewBoardArray() {
    const boardArray = [];
    DEFAULT_BOARD_DIMENSIONS.forEach(rowSize => {
        const row = [];
        for (let i = 0; i < rowSize; i++) {
            row.push(false);
        }
        boardArray.push(row);
    });
    return boardArray;
}

function getGameType() {
    return window.location.pathname === "/find-friend-local.html" ? "local" : "remote";
}

document.getElementById('submit-game-request-button').addEventListener('click', onSubmitButtonClick);
