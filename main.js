'use strict';

async function authenticateToken() {
    let existingToken = getAuthTokenFromLocalStorage();
    if (existingToken) {
        try {
            let response = await getAuthenticateTokenResponse(existingToken);
            parseAuthenticateTokenResponse(response);
        } catch (err) {
            console.log('Failed to connect to the server when authenticating existing token.');
        }
    } else {
        if (!(window.location.href === 'login.html')) {
            console.log(window.location.href);
            window.location.href = 'login.html';
        }
    }
}

async function getAuthenticateTokenResponse(token) {
    // Return artificial data

    return new Promise((resolve, reject) => {
        console.log(`Simulating accessing server to authenticate token. Token: '${token}'`);

        // TODO create time-based artificial data (including random server failures?)

        let response = {};

        if (token.username === "") {
            response = new ErrorResponse('invalidUser');
        } else if (token.tokenString == "") {
            response = new ErrorResponse('invalidTokenString');
        } else {
            response = new AuthResponse(token);
        }

        setTimeout(() => resolve(response), 2000);
        // resolve(response);
    });
}

function parseAuthenticateTokenResponse(response) {
    if (isValidResponse(response)) {
        loginUser(response.token);
        return true;
    } else {
        console.log('Failed to authenticate existing token. Clearing token');
        clearUserInfoFromLocalStorage();
        return false;
    }
}

function invalidateToken(token) {
    clearUserInfoFromLocalStorage();
    // TODO Send message to server to invalidate the token
}

function getAuthTokenFromLocalStorage() {
    let serializedToken = localStorage.getItem('authtoken');
    if (serializedToken) {
        let token = JSON.parse(serializedToken);
        let {username, tokenString} = token;
        console.log(`extracted user: ${username}, extracted string: ${tokenString}`);
        if (username && tokenString) {
            return token;
        }
    }
    return null;
}

function clearUserInfoFromLocalStorage() {
    localStorage.removeItem('authtoken');
    localStorage.removeItem('user');
}

class HTTPResponse {
    #value;
    constructor(value) {
        this.#value = value;
    }

    get value() {return this.#value;}
}

class ErrorResponse extends HTTPResponse {
    #errorType;
    constructor(errorType) {
        super('error');
        this.#errorType = errorType;
    }
    get errorType() {return this.#errorType;}
}

class AuthResponse extends HTTPResponse {
    #token;
    constructor(token) {
        super('token');
        this.#token = token;
    }
    get token() {return this.#token;}
}
