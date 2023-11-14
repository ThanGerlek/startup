'use strict';

// TODO js: server: account creation

// TODO server: change logout from a simple redirect to returning a completely different HTTP response

// TODO js: replace custom isValidResponse() functions with predefined ones on JS's native Response object

import {cancelWaitNotification, clearMessageDisplay, displayMessage, setupWaitNotification} from "./message-display.js";

function onLoginButtonClick() {
    clearMessageDisplay();
    setupWaitNotification();
    authenticateLogin(); // TODO Convert to use .then()
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
    try {
        const response = await fetch('/session', {
            method: 'POST', body: JSON.stringify({
                username: username, password: hashedPassword
            }), headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        });
        const jsonResponse = await response.json(); // TODO Remove test code
        const str = JSON.stringify(jsonResponse);
        console.log(str);
        return jsonResponse;
    } catch (e) {
        throw e;
    }
}

function parseLoginResponse(response) {
    if (response.token) {
        loginUser(response.token);
    } else if (!response.message) {
        displayMessage('error', 'Failed to parse HTTP response!');
    } else {
        displayMessage('warn', response.message);
    }
}

function loginUser(token) {
    console.log(`Your token string is: '${token.tokenString}'`);
    localStorage.setItem('tokenString', JSON.stringify(token));
    localStorage.setItem('username', token.username);
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

    return text;
}

document.getElementById('login-button').addEventListener('click', () => {
    authenticateToken(redirectToHomePage, onLoginButtonClick);
    // TODO Convert to use .then()
});
