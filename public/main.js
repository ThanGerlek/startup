'use strict';

// TODO Make main.js a proper module using export or something

function loadFakeTokenData() {
    localStorage.setItem('username', 'john');
    let token = {username: 'john', tokenString: 'pi/2'};
    localStorage.setItem('tokenString', JSON.stringify(token));
}


function logout() {
    invalidateToken(getTokenStringFromLocalStorage());
    clearStorage();
    redirectToLoginPage();
}

async function silentAuthenticateToken() {
    await authenticateToken(() => {
    }, redirectToLoginPage);
}

async function authenticateToken(successAction, failureAction) {
    let existingToken = getTokenStringFromLocalStorage();
    if (existingToken) {
        try {
            let response = await getAuthenticateTokenResponse(existingToken);
            parseAuthenticateTokenResponse(response, successAction, failureAction);
        } catch (err) {
            console.log('Failed to connect to the server when authenticating existing token.');
            failureAction();
        }
    } else {
        failureAction();
    }
}

async function getAuthenticateTokenResponse(token) {

    // TODO Replace with real authentication

    try {
        const response = await fetch('/session', {
            method: 'GET', headers: {
                'Content-type': 'application/json; charset=UTF-8', 'authorization': token,
            },
        });
        return await response.json();
    } catch (e) {
        throw e;
    }
}

function parseAuthenticateTokenResponse(response, successAction, failureAction) {

    // TODO Replace with real authentication

    if (response.message === 'OK') {
        successAction();
    } else {
        console.log('Failed to authenticate existing token. Clearing token');
        invalidateToken(response.token);
        failureAction();
    }
}

function invalidateToken(token) {
    clearUserInfoFromLocalStorage();
}

function clearStorage() {
    localStorage.clear();
}

function getTokenStringFromLocalStorage() {
    let tokenString = localStorage.getItem('tokenString');
    if (tokenString) {
        console.log(`Found token string '${tokenString}' in local storage`);
        return tokenString;
    }
    return null;
}

function clearUserInfoFromLocalStorage() {
    localStorage.removeItem('tokenString');
    localStorage.removeItem('username');
}

function redirectToLoginPage() {
    window.location.replace('login.html');
}

function redirectToHomePage() {
    window.location.replace('home.html');
}

class HTTPResponse {
    #value;

    constructor(value) {
        this.#value = value;
    }

    get value() {
        return this.#value;
    }
}

// TODO? Remove and replace with JS's native Response object
class OKResponse extends HTTPResponse {
    constructor() {
        super('200 OK');
    }
}

class ErrorResponse extends HTTPResponse {
    #errorType;

    constructor(errorType) {
        super('error');
        this.#errorType = errorType;
    }

    get errorType() {
        return this.#errorType;
    }
}

class AuthResponse extends HTTPResponse {
    #token;

    constructor(token) {
        super('token');
        this.#token = token;
    }

    get token() {
        return this.#token;
    }
}
