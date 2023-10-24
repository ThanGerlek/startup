'use strict';

function onSubmitButtonClick() {
    clearMessageDisplay();
    setupWaitNotification();
    submitGameRequest();
}

async function submitGameRequest() {
    let senderUsername = localStorage.getItem('user');
    let receiverUsername = document.getElementById('otherUsernameBox');
    console.log(`Submitting game request from user '${senderUsername}' to user '${receiverUsername}'`);

    try {
        let response = await getGameRequestResponse();
        cancelWaitNotification();
        parseGameRequestResponse(response);
    } catch (err) {
        // failed to connect to server
        let msg = `Failed to connect to the server. Make sure you're connected to the internet, or try again later.`;
        cancelWaitNotification();
        displayMessage('error', msg);
    }
}

async function getGameRequestResponse() {
    // simulate accessing server
    // generate fake data
}

function parseGameRequestResponse(response) {
    // if successful, redirect to wait-for-friend, otherwise display error
}






// DUPLICATED CODE: Message display code



function setupWaitNotification() {
    window.waitNotification = setTimeout(() => {
        // TODO? Separate from other messages (don't want this to overwrite them)
        displayMessage('info', 'Please wait...');
    }, 1000);
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
