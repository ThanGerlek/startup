'use strict';

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
        if (receiverUsername === "test-bad-response") {
            console.log('Test: simulating recieving a malformed response');
            response = {value: 'blue', errorType: 'french fries'};
        } else if (receiverUsername === "test-server-access-failure") {
            console.log('Test: simulating a server access failure');
            reject();
        }

        // TODO create time-based artificial data (including random server failures?)
        setTimeout(() => resolve(response), 2000);
        // resolve(response);
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





// DUPLICATED CODE: Message display code



function setupWaitNotification() {
    window.waitNotification = setTimeout(() => {
        // TODO? Separate from other messages (don't want this to overwrite them)
        displayMessage('info', 'Connecting to the server, please wait...');
    }, 1000);
    // BUG Wait notification doesn't display (it should pause for 1s, display for 1s, then redirect)
}

function cancelWaitNotification() {
    if (window.waitNotification) {
        clearTimeout(window.waitNotification);
        delete window.waitNotification;
    }
}

function displayMessage(msgType, msg) {
    clearMessageDisplay();
    let msgElement = getMessageElement(msgType);
    msgElement.textContent = msg;
    msgElement.style.display = 'inline';
}

function clearMessageDisplay() {
    let messageTypes = ['info', 'warn', 'error'];
    let messageElements = messageTypes.map((msgType) => getMessageElement(msgType));
    messageElements.forEach((msgElement) => {
        msgElement.textContent = '';
        msgElement.style.display = 'none';
    });
}
function getMessageElement(msgType) {
    if (!(msgType === 'info' || msgType === 'warn' || msgType === 'error')) {
        throw new Error(`Invalid message element type '${msgType}' (must be one of 'info', 'warn', 'error')`)
    }

    let elementId = msgType + '_message';
    let msgElement = document.getElementById(elementId);
    if (msgElement == null) {
        throw new Error(`Couldn't find message element ${elementId}!`);
    } else {
        return msgElement;
    }
}
