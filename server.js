'use strict'

const cookieParser = require('cookie-parser');

const config = require("./config.json");
const database = require('./server/database');
const handler = require('./server/handler');
const security = require('./server/security');
const services = require('./server/services/services');

// Load express router
const express = require('express');
const app = express();

// Load middleware
app.use(express.json());
app.use(cookieParser());

// Provide static pages
app.use(express.static('public'));

// Log requests
app.use((req, res, next) => {
    let safeBody = security.stripSecureInfo(req.body);
    console.log(`Received request: ${req.method} ${req.originalUrl} ${JSON.stringify(safeBody)}`);
    next();
});


// Endpoint: Clear application
app.delete('/db', async (req, res) => {
    try {
        await database.connectAndRun(async (dataAccessManager) => {
            const service = new services.ClearApplicationService(dataAccessManager);
            const response = await service.clearApplication();
            res.send(response);
        });
    } catch (e) {
        handler.handleResponseError(res, e);
    }
});
// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Clears the database. Removes all users, games, and authTokens. |
// | **Success response** | [200]                                                          |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |


// Endpoint: Register
app.post('/user', async (req, res) => {
    try {
        await database.connectAndRun(async (dataAccessManager) => {
            const service = new services.RegisterService(dataAccessManager);
            const authResponse = await service.register(req.body);
            security.setAuthCookie(res, authResponse.token);
            res.send(security.stripSecureInfo(authResponse));
        });
    } catch (e) {
        handler.handleResponseError(res, e);
    }
});
// | **Request class**    | RegisterRequest                               |
// | **Response class**   | AuthResponse (stripped)                       |
// | **Description**      | Register a new user.                          |
// | **Body**             | `{ "username":"", "password":"" }`            |
// | **Success response** | [200]                                         |
// | **Failure response** | [400] `{ "message": "Error: bad request" }`   |
// | **Failure response** | [403] `{ "message": "Error: already taken" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`   |


//  Endpoint: Login
app.post('/session', async (req, res) => {
    try {
        await database.connectAndRun(async (dataAccessManager) => {
            const service = new services.LoginService(dataAccessManager);
            const authResponse = await service.login(req.body);
            security.setAuthCookie(res, authResponse.token);
            res.send(security.stripSecureInfo(authResponse));
        });
    } catch (e) {
        handler.handleResponseError(res, e);
    }
});
// | **Request class**    | LoginRequest                                    |
// | **Response class**   | AuthResponse (stripped)                         |
// | **Description**      | Logs in an existing user (returns a new token). |
// | **Body**             | `{ "username":"", "password":"" }`              |
// | **Success response** | [200]                                           |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }`    |
// | **Failure response** | [500] `{ "message": "Error: description" }`     |


// Require valid auth token for secureRouter endpoints
const secureRouter = express.Router();
app.use(secureRouter);
secureRouter.use(security.requireAuthCookie);


// Endpoint: Get User Data
secureRouter.get('/user/:username', async (req, res) => {
    try {
        await database.connectAndRun((dataAccessManager) => {
            const username = req.params.username;
            const tokenString = security.getAuthCookie(req);
            const service = new services.GetUserDataService(dataAccessManager);
            const response = service.getUserData(username, tokenString);
            res.send(response);
        })
    } catch (e) {
        handler.handleResponseError(res, e);
    }
});


// Endpoint: Get Current User Data
secureRouter.get('/me', async (req, res) => {
    try {
        await database.connectAndRun((dataAccessManager) => {
            const tokenString = security.getAuthCookie(req);
            const service = new services.GetUserDataService(dataAccessManager);
            const response = service.getUserData(tokenString);
            // TODO check correct username
            res.send(response);
        })
    } catch (e) {
        handler.handleResponseError(res, e);
    }
});


//  Endpoint: Logout
secureRouter.delete('/session', async (req, res) => {
    try {
        await database.connectAndRun(async (dataAccessManager) => {
            const service = new services.LogoutService(dataAccessManager);
            const response = await service.logout(security.getAuthCookie(req));
            security.clearAuthCookie(res);
            res.send(response);
        });
    } catch (e) {
        handler.handleResponseError(res, e);
    }
});
// | **Request class**    | N/A (no request body)                        |
// | **Response class**   | MessageResponse                              |
// | **Description**      | Logs out the user represented by the token.  |
// | **Cookies**          | `authorization: <token>`                     |
// | **Success response** | [200]                                        |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`  |


//  Endpoint: Join Game
secureRouter.post('/game', async (req, res) => {
    try {
        await database.connectAndRun(async (dataAccessManager) => {
            const service = new services.JoinGameService(dataAccessManager);
            const response = await service.joinGame(req.body);
            res.send(response);
        });
    } catch (e) {
        handler.handleResponseError(res, e);
    }
});
// | **Request class**    | JoinGameRequest                                                                                                                                                                            |
// | **Response class**   | MessageResponse                                                                                                                                                                            |
// | **Description**      | If a game with the specified players exists, joins the game. Otherwise, if a game request exists, a new (empty) game is created and WS requests are sent. Otherwise, a request is created. |
// | **Cookies**          | `authorization: <authToken>`                                                                                                                                                               |
// | **Body**             | `{ "player":"playerName", "opponent": "opponentName", "firstPlayer": "playerName" }`                                                                                                       |
// | **Success response** | [200] `{ "message": "OK", "board": <boardState> }`                                                                                                                                         |
// | **Failure response** | [400] `{ "message": "Error: bad request" }`                                                                                                                                                |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }`                                                                                                                                               |
// | **Failure response** | [403] `{ "message": "Error: already taken" }`                                                                                                                                              |
// | **Failure response** | [500] `{ "message": "Error: description" }`                                                                                                                                                |


module.exports = app;
