const cookieParser = require('cookie-parser');

const database = require('./database');
const handler = require('./handler');
const security = require('./security');
const services = require('./services/services');

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

const apiRouter = express.Router();
app.use('/api', apiRouter);

// Endpoint: Clear application
apiRouter.delete('/db', async (req, res) => {
    console.log('Hit endpoint: clear application');
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
apiRouter.post('/user', async (req, res) => {
    console.log('Hit endpoint: register');
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
apiRouter.post('/session', async (req, res) => {
    console.log('Hit endpoint: login');
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
apiRouter.use('/secure', secureRouter);
secureRouter.use(security.requireAuthCookie);


// Endpoint: Get User Data
secureRouter.get('/user/:username', async (req, res) => {
    console.log('Hit secure endpoint: get user data');
    try {
        await database.connectAndRun(async (dataAccessManager) => {
            const username = req.params.username;
            const tokenString = security.getAuthCookie(req);
            const service = new services.GetUserDataService(dataAccessManager);
            const response = await service.getUserData(tokenString, username);
            res.send(response);
        })
    } catch (e) {
        handler.handleResponseError(res, e);
    }
});


// Endpoint: Get Current User Data
secureRouter.get('/me', async (req, res) => {
    console.log('Hit secure endpoint: /me');
    try {
        await database.connectAndRun(async (dataAccessManager) => {
            const tokenString = security.getAuthCookie(req);
            const service = new services.GetUserDataService(dataAccessManager);
            const response = await service.getUserData(tokenString);
            res.send(response);
        });
    } catch (e) {
        handler.handleResponseError(res, e);
    }
});


//  Endpoint: Logout
secureRouter.delete('/session', async (req, res) => {
    console.log('Hit secure endpoint: logout');
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
    console.log('Hit secure endpoint: join game');
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


// Return the application's default page if the path is unknown
app.use((_req, res) => {
    res.sendFile('index.html', { root: 'public' });
});

module.exports = app;
