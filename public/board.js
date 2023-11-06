'use strict';

import {cancelWaitNotification, clearMessageDisplay, displayMessage, setupWaitNotification} from "./message-display.js";

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

export { submitMoveToServer };
