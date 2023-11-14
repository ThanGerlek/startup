'use strict';

// TODO js: replace custom isValidResponse() functions with predefined ones on JS's native Response object

// TODO js: reduce duplicated code from login.js

import {cancelWaitNotification, clearMessageDisplay, displayMessage, setupWaitNotification} from "./message-display.js";

function onRegisterButtonClick() {
    clearMessageDisplay();
    setupWaitNotification();
    registerAccount(); // TODO Convert to use .then()
}

async function registerAccount() {
    let hashedPassword = extractPassword();
    let username = extractUsername();
    try {
        const response = await getRegisterAccountResponse(username, hashedPassword);
        cancelWaitNotification();
        parseRegisterResponse(response);
    } catch (err) {
        cancelWaitNotification();
        let msg = `Failed to connect to the server. Make sure you're connected to the internet, or try again later.`;
        displayMessage('error', msg);
    }
}

async function getRegisterAccountResponse(username, hashedPassword) {
    try {
        const response = await fetch('/user', {
            method: 'POST', body: JSON.stringify({
                username: username, password: hashedPassword
            }), headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        });
        return await response.json();
    } catch (e) {
        throw e;
    }
}

function parseRegisterResponse(response) {
    if (response.token) {
        loginUser(response.token, response.username);
    } else if (!response.message) {
        displayMessage('error', 'Failed to parse HTTP response!');
    } else {
        displayMessage('warn', response.message);
    }
}

function loginUser(tokenString, username) {
    console.log(`Your token string is: '${tokenString}'`);
    localStorage.setItem('tokenString', tokenString);
    localStorage.setItem('username', username);
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

document.getElementById('register-button').addEventListener('click', () => {
    authenticateToken(redirectToHomePage, onRegisterButtonClick);
    // TODO Convert to use .then()
});
