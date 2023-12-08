'use strict';

import {displayMessage} from "./message-display.js";
import {DEFAULT_BOARD_DIMENSIONS} from "./board.mjs";

function onSubmitButtonClick() {
    let playerUsername = localStorage.getItem('username');
    let opponentUsername = document.getElementById('otherUsernameBox').value;

    if (opponentUsername === "") {
        displayMessage('warn', 'Please enter a username.');
    } else if (opponentUsername === playerUsername) {
        displayMessage('warn', "Woah! That's your friend's name! Please try something else.");
    } else {
        localStorage.setItem('opponentUsername', opponentUsername); // TODO? Unneeded?
        storeNewGame(playerUsername, opponentUsername);
        window.location.href = 'game.html';
    }
}

function storeNewGame(playerUsername, opponentUsername) {
    const gameData = {
        playerUsername: playerUsername,
        opponentUsername: opponentUsername,
        isPlayerTurn: true, // TODO allow switching who goes first
        board: generateNewBoardArray(),
        gameType: 'local',
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

document.getElementById('submit-game-request-button').addEventListener('click', onSubmitButtonClick);
