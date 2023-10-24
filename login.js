'use strict';

// TODO account creation

// TODO change logout from a simple redirect to returning a completely different HTTP response

function onLoginButtonClick() {
    clearMessageDisplay();
    setupWaitNotification();
    authenticateLogin();
}

async function authenticateLogin() {
    let hashedPassword = extractPassword();
    let username = extractUsername();
    try {
        let response = await getAuthenticateLoginResponse(username, hashedPassword);
        cancelWaitNotification();
        parseLoginResponse(response);
    } catch (err) {
        cancelWaitNotification();
        let msg = `Failed to connect to the server. Make sure you're connected to the internet, or try again later.`;
        displayMessage('error', msg);
    }
}

async function getAuthenticateLoginResponse(username, hashedPassword) {
    // Return artificial data
    
    return new Promise((resolve, reject) => {
        console.log(`Simulating accessing server. User: '${username}', hpass: '${hashedPassword}'`);

        let response = {};

        if (username === "") {
            response = new ErrorResponse('invalidUser');
        } else if (hashedPassword == hash("")) {
            response = new ErrorResponse('incorrectPassword');
        } else {
            let token = {username: username, tokenString: 'pi/2'};
            response = new AuthResponse(token);
        }

        // TODO remove test code
        if (username === "test-bad-response") {
            console.log('Test: simulating recieving a malformed response');
            response = {value: 'blue', errorType: 'french fries',  token: {tokenString: 'ur face', username: 'abraham lincoln'}};
        } else if (username === "test-server-access-failure") {
            console.log('Test: simulating a server access failure');
            reject();
        }

        // TODO create time-based artificial data (including random server failures?)
        setTimeout(() => resolve(response), 2000);
        // resolve(response);
    });
}

function parseLoginResponse(response) {
    if (response.value === 'token') {
        loginUser(response.token);
    } else if (isInvalidUserResponse(response)) {
        displayMessage('warn', 'Incorrect username.');
    } else if (isIncorrectPasswordResponse(response)) {
        displayMessage('warn',  'Incorrect password.');
    } else {
        displayMessage('error', 'Failed to parse HTTP response!');
    }
}

function isInvalidUserResponse(response) {
    return response.value === 'error' && response.errorType === 'invalidUser'; // temporary artificial implementation
}

function isIncorrectPasswordResponse(response) {
    return response.value === 'error' && response.errorType === 'incorrectPassword'; // temporary artificial implementation    
}

function loginUser(token) {
    console.log(`Your token string is: '${token.tokenString}'`);
    clearTimeout(window.waitNotification);
    localStorage.setItem('authtoken', JSON.stringify(token));
    localStorage.setItem('user', token.username);
    displayMessage('info', 'Redirecting...');
    window.location.href = 'home.html';
}

function setupWaitNotification() {
    window.waitNotification = setTimeout(() => displayWaitNotification(), 1000);
    console.log('Please wait while we log you in.');
}

function cancelWaitNotification() {
    if (window.waitNotification) {
        clearTimeout(window.waitNotification);
        delete window.waitNotification;
    }
}

function displayWaitNotification() {
    displayMessage('info', 'Please wait...');
    // TODO? Separate from other messages (don't want this to overwrite them)
}

function clearMessageDisplay() {
    let messageTypes = ['info', 'warn', 'error'];
    let messageElements = messageTypes.map((msgType) => getMessageElement(msgType));
    messageElements.forEach((msgElement) => {
        msgElement.textContent = '';
        msgElement.style.display = 'none';
    });
}

function displayMessage(msgType, msg) {
    clearMessageDisplay();
    let msgElement = getMessageElement(msgType);
    msgElement.textContent = msg;
    msgElement.style.display = 'inline';
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

function extractUsername() {
    return document.getElementById('usernameBox').value;
}

function extractPassword() {
    let hashedPassword = hash(document.getElementById('passwordBox').value);
    document.getElementById('passwordBox').value = '';
    return hashedPassword;
}

function hash(text) {
    // TODO pull in a secure hashing algorithm
    console.warn('Warning: password hashing is unimplemented!');
    if (text === "") {
        return 0;
    }

    return 42;
}
