'use strict';

import { displayMessage } from "./message-display.js";
 
function onSubmitButtonClick() {
    let playerUsername = localStorage.getItem('user');
    let opponentUsername = document.getElementById('otherUsernameBox').value;

    if (opponentUsername === "") {
        displayMessage('warn', 'Please enter a username.');
    } else if (opponentUsername === playerUsername) {
        displayMessage('warn', "Woah! That's your friend's name! Please try something else.");
    } else {
        localStorage.setItem('opponentUsername', opponentUsername);
        window.location.href = 'board.html';
    }
}

document.getElementById('submit-game-request-button').addEventListener('click', () => onSubmitButtonClick());
