'use strict';

import { setupWaitNotification, cancelWaitNotification, displayMessage, clearMessageDisplay } from "./message-display.js";
 
function onSubmitButtonClick() {
    clearMessageDisplay();
    setupWaitNotification();
    submitGameRequest();
}

async function submitGameRequest() {
    let senderUsername = localStorage.getItem('user');
    let receiverUsername = document.getElementById('otherUsernameBox').value;
    console.log(`Submitting game request from user '${senderUsername}' to user '${receiverUsername}'`);

    try {
        let response = await getGameRequestResponse(senderUsername, receiverUsername);
        cancelWaitNotification();
        parseGameRequestResponse(response, receiverUsername);
    } catch (err) {
        // failed to connect to server
        let msg = `Failed to connect to the server. Make sure you're connected to the internet, or try again later.`;
        cancelWaitNotification();
        displayMessage('error', msg);
    }
}

async function getGameRequestResponse(senderUsername, receiverUsername) {
    // Return artificial data

    return new Promise((resolve, reject) => {
        console.log(`Simulating accessing server with game request.`);

        let response = {};

        if (receiverUsername === "") {
            response = new ErrorResponse('invalidUser');
        } else {
            response = new HTTPResponse('200 OK');
        }


        // TODO remove test code
        if (receiverUsername === "test-server-access-failure") {
            console.log('Test: simulating a server access failure');
            reject();
        } else {

            if (receiverUsername === "test-bad-response") {
                console.log('Test: simulating recieving a malformed response');
                response = {value: 'blue', errorType: 'french fries'};
            }
            
            // TODO create time-based artificial data (including random server failures?)
            setTimeout(() => resolve(response), 2000);
            // resolve(response);

        }
    });
}

function parseGameRequestResponse(response, receiverUsername) {
    // if successful, redirect to wait-for-friend, otherwise display error
    if (response.value === '200 OK') {
        setUpForConnection(response, receiverUsername);
    } else if (isInvalidUserResponse(response)) {
        displayMessage('warn', 'User not found.');
    } else {
        displayMessage('error', 'Failed to parse HTTP response!');
    }
}

function isInvalidUserResponse(response) {
    return response.value === 'error' && response.errorType === 'invalidUser'; // temporary artificial implementation
}

function setUpForConnection(response, receiverUsername) {
    openWebSocketConnection(response);
    localStorage.setItem('gameRequestReceiverUsername', receiverUsername);
    window.location.href = 'wait-for-friend.html?requestreceiveruser=' + receiverUsername;
    //TODO! Warning: this^^^ means usernames MUST be URL-safe (no '?', no ' ', etc.)
    //TODO Choose either localStorage or URL ? for sending username, but not both
}

function openWebSocketConnection(response) {
    console.log(`Simulating opening WebSocket connection.`);
    // TODO implement WebSocket
}


document.getElementById('submit-game-request-button').addEventListener('click', () => onSubmitButtonClick());
