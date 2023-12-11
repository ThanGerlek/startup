'use strict';

import {cancelWaitNotification, clearMessageDisplay, displayMessage, setupWaitNotification} from "./message-display.js";

function onSubmitButtonClick() {
    clearMessageDisplay();
    setupWaitNotification();
    submitGameRequest(); // TODO convert to use .then() to redirect
}

async function submitGameRequest() {
    let senderUsername = localStorage.getItem('username');
    let receiverUsername = document.getElementById('otherUsernameBox').value;
    console.log(`Submitting game request from user '${senderUsername}' to user '${receiverUsername}'`);

    try {
        let response = await getGameRequestResponse(senderUsername, receiverUsername);
        cancelWaitNotification();
        parseGameRequestResponse(response);
    } catch (err) {
        // failed to connect to server
        let msg = `Failed to connect to the server. Make sure you're connected to the internet, or try again later.`;
        cancelWaitNotification();
        displayMessage('error', msg);
    }
}

async function getGameRequestResponse(senderUsername, receiverUsername) {
    let authorization = localStorage.getItem('tokenString');
    if (authorization) {
        authorization = JSON.parse(authorization).tokenString;
    }

    fetch('https://startup.gerleksgarage.click/game', {
        method: 'PUT', body: JSON.stringify({
            playerOne: senderUsername, playerTwo: receiverUsername
        }), headers: {
            'Content-type': 'application/json; charset=UTF-8', 'authorization': authorization,
        },
    }).then(response => response.json())
        .then(response => console.log(response));
}

function parseGameRequestResponse(response) {
    if (!response.message) {
        displayMessage('error', 'Failed to parse HTTP response. Please try again');
    } else if (response.message !== "OK") {
        displayMessage('warn', response.message);
    } else if (response.game) {
        beginGame(response);
    } else {
        waitForFriend(response);
    }
}

function beginGame(response) {
    openWebSocketConnection(response);
    window.game = response.game;
    window.location.href = 'board.html';
}

function waitForFriend(response, receiverUsername) {
    openWebSocketConnection(response);
    localStorage.setItem('opponentUsername', receiverUsername);
    window.location.href = 'wait-for-friend.html';
}

function openWebSocketConnection(response) {
    console.log('Simulating opening WebSocket connection.');
    // TODO ws: implement WebSocket
}

document.getElementById('submit-game-request-button').addEventListener('click', onSubmitButtonClick);
