'use strict'

const {MongoClient} = require("mongodb");
const cookieParser = require('cookie-parser');

const {ErrorResponse, MessageResponse} = require('./server/http');
const {handleResponseError} = require("./server/handler");

const {DataAccessManager} = require('./server/dataAccess/dataAccess');
const config = require("./config.json");
const services = require('./server/services/services');

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    next();
});


function mongoURL() {
    return `mongodb+srv://${config.database.username}:${config.database.password}@${config.database.hostname}`;
}


async function connectToDatabaseAndRun(callback) {
    const client = new MongoClient(mongoURL());
    await client.connect();
    try {
        const db = client.db(config.database.dbName);
        const dataAccessManager = new DataAccessManager(db);
        return callback(dataAccessManager);
    } finally {
        // await client.close();
    }
}

function setAuthCookie(res, token) {
    res.cookie(config.cookie.authCookieName, token, {
        sameSite: 'strict', httpOnly: true, secure: true
    });
}

function clearAuthCookie(res) {
    res.clearCookie(config.cookie.authCookieName);
}

function getAuthCookie(req) {
    return req.cookies[config.cookie.authCookieName];
}


// Clear application
app.delete('/db', async (req, res) => {
    try {
        await connectToDatabaseAndRun(async (dataAccessManager) => {
            const service = new services.ClearApplicationService(dataAccessManager);
            const response = await service.clearApplication();
            res.send(response);
        });
    } catch (e) {
        handleResponseError(res, e);
    }
});
// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Clears the database. Removes all users, games, and authTokens. |
// | **Success response** | [200]                                                          |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |


// Register
app.post('/user', async (req, res) => {
    try {
        await connectToDatabaseAndRun(async (dataAccessManager) => {
            const service = new services.RegisterService(dataAccessManager);
            const authResponse = await service.register(req.body);
            setAuthCookie(res, authResponse.token);
            res.send(new MessageResponse(authResponse.message));
        });
    } catch (e) {
        handleResponseError(res, e);
    }
});
// | **Request class**    | RegisterRequest                               |
// | **Response class**   | MessageResponse                               |
// | **Description**      | Register a new user.                          |
// | **Body**             | `{ "username":"", "password":"" }`            |
// | **Success response** | [200]                                         |
// | **Failure response** | [400] `{ "message": "Error: bad request" }`   |
// | **Failure response** | [403] `{ "message": "Error: already taken" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`   |


//  Login
app.post('/session', async (req, res) => {
    try {
        await connectToDatabaseAndRun(async (dataAccessManager) => {
            const service = new services.LoginService(dataAccessManager);
            const authResponse = await service.login(req.body);
            setAuthCookie(res, authResponse.token);
            res.send(new MessageResponse(authResponse.message));
        });
    } catch (e) {
        handleResponseError(res, e);
    }
});
// | **Request class**    | LoginRequest                                    |
// | **Response class**   | MessageResponse                                 |
// | **Description**      | Logs in an existing user (returns a new token). |
// | **Body**             | `{ "username":"", "password":"" }`              |
// | **Success response** | [200]                                           |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }`    |
// | **Failure response** | [500] `{ "message": "Error: description" }`     |


const secureRouter = Express.Router();
app.use(secureRouter);


secureRouter.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).send(new ErrorResponse("No credentials provided"));
        return;
    }

    const token = req.headers.authorization;

    const client = new MongoClient(mongoURL());
    await client.connect();
    try {
        const db = client.db(config.database.dbName);
        const authDAO = new DataAccessManager(db).getAuthDAO();
        const isValid = await authDAO.isValidToken(token);

        if (!isValid) {
            res.status(401).send(new ErrorResponse("Could not authenticate; an invalid token was provided"));
            return;
        }

    } finally {
        await client.close();
    }

    next();
});


// get user data
secureRouter.get('/user/:username', async (req, res) => {
    try {
        await connectToDatabaseAndRun((dataAccessManager) => {
            const service = new services.GetUserDataService(dataAccessManager);
            const response = service.getUserData(req.body);
            // TODO check correct username
            res.send(response);
        })
    } catch (e) {
        handleResponseError(res, e);
    }
});


//  Logout
secureRouter.delete('/session', async (req, res) => {
    try {
        await connectToDatabaseAndRun(async (dataAccessManager) => {
            const service = new services.LogoutService(dataAccessManager);
            const response = await service.logout(req.headers.authorization);
            clearAuthCookie(res);
            res.send(response);
        });
    } catch (e) {
        handleResponseError(res, e);
    }
});
// | **Request class**    | N/A (no request body)                        |
// | **Response class**   | MessageResponse                              |
// | **Description**      | Logs out the user represented by the token.  |
// | **Cookies**          | `authorization: <token>`                     |
// | **Success response** | [200]                                        |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`  |


//  Join Game
secureRouter.post('/game', async (req, res) => {
    try {
        await connectToDatabaseAndRun(async (dataAccessManager) => {
            const service = new services.JoinGameService(dataAccessManager);
            const response = await service.joinGame(req.body);
            res.send(response);
        });
    } catch (e) {
        handleResponseError(res, e);
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
