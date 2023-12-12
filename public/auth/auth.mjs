'use strict';

// TODO server: change logout from a simple redirect to returning a completely different HTTP response

import {cancelWaitNotification, clearMessageDisplay, displayMessage, setupWaitNotification} from "../general/message-display.js";

function onLoginButtonClick() {
    onAuthenticateButtonClick('/session');
}

export function onAuthenticateButtonClick(apiPath) {
    clearMessageDisplay();
    setupWaitNotification();
    authenticate(apiPath);
}


async function authenticate(apiPath) {
    let password = extractPassword();
    let username = extractUsername();
    try {
        const response = await getAuthenticateResponse(username, password, apiPath);
        cancelWaitNotification();
        parseResponse(response);
    } catch (err) {
        cancelWaitNotification();
        let msg = `Failed to connect to the server. Make sure you're connected to the internet, or try again later.`;
        displayMessage('error', msg);
    }
}

async function getAuthenticateResponse(username, password, apiPath) {
    try {
        const response = await fetch(apiPath, {
            method: 'POST', body: JSON.stringify({
                username: username, password: password
            }), headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        });
        return await response.json();
    } catch (e) {
        throw e;
    }
}

function parseResponse(response) {
    if (response.username) {
        loginUser(response.username);
    } else if (!response.message) {
        displayMessage('error', 'Failed to parse HTTP response!');
    } else {
        displayMessage('warn', response.message);
    }
}

function loginUser(username) {
    console.log(`Authenticated user: '${username}'`);
    localStorage.setItem('username', username);
    displayMessage('info', 'Redirecting...');
    window.location.href = 'home.html';
}

function extractUsername() {
    return document.getElementById('usernameBox').value;
}

function extractPassword() {
    let password = document.getElementById('passwordBox').value;
    document.getElementById('passwordBox').value = '';
    return password;
}

document.getElementById('login-button').addEventListener('click', onLoginButtonClick);
document.getElementById('register-button').addEventListener('click', () => {
    window.location.href = 'register.html';
});