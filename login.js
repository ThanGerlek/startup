'use strict';

// TODO js: server: account creation

// TODO server: change logout from a simple redirect to returning a completely different HTTP response

import { setupWaitNotification, cancelWaitNotification, displayMessage, clearMessageDisplay } from "./message-display.js";

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

        // TODO server: remove test code
        if (username === "test-bad-response") {
            console.log('Test: simulating recieving a malformed response');
            response = {value: 'blue', errorType: 'french fries',  token: {tokenString: 'ur face', username: 'abraham lincoln'}};
        } else if (username === "test-server-access-failure") {
            console.log('Test: simulating a server access failure');
            reject();
        }

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
    localStorage.setItem('authtoken', JSON.stringify(token));
    localStorage.setItem('user', token.username);
    displayMessage('info', 'Redirecting...');
    window.location.href = 'home.html';
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
    // TODO auth: pull in a secure hashing algorithm
    console.warn('Warning: password hashing is unimplemented!');
    if (text === "") {
        return 0;
    }

    return 42;
}

document.getElementById('login-button').addEventListener('click', () => {
    authenticateToken(redirectToHomePage, onLoginButtonClick);
});
