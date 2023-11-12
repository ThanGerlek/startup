'use strict'

const {ErrorResponse} = require('./server/http')
const {handleResponse} = require("./server/handler");

const dataAccessObjects = require('./server/dataAccess/dataAccess').getNewDAOs();
const services = require('./server/services/services').getServicesFromDataSource(dataAccessObjects);

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const express = require('express');
const app = express();

app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`req.originalUrl: '${req.originalUrl}', body: '${req.body}'`);
    next();
})


// Clear application
app.delete('/db', (req, res) => {
    // TODO test
    handleResponse(res, () => {
        return services.clearApplicationService.clearApplication();
    });
});
// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Clears the database. Removes all users, games, and authTokens. |
// | **Success response** | [200]                                                          |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |


// Register
app.post('/user', jsonParser, (req, res) => {
    // TODO test
    handleResponse(res, () => {
        return services.registerService.register(req.body);
    });
});
// | **Request class**    | RegisterRequest                               |
// | **Response class**   | AuthResponse                                  |
// | **Description**      | Register a new user.                          |
// | **Body**             | `{ "username":"", "password":"" }`            |
// | **Success response** | [200] `{ "username":"", "token":"" }`         |
// | **Failure response** | [400] `{ "message": "Error: bad request" }`   |
// | **Failure response** | [403] `{ "message": "Error: already taken" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`   |


//  Login
app.post('/session', jsonParser, (req, res) => {
    // TODO test
    handleResponse(res, () => {
        return services.loginService.login(req.body);
    });
});
// | **Request class**    | LoginRequest                                    |
// | **Response class**   | AuthResponse                                    |
// | **Description**      | Logs in an existing user (returns a new token). |
// | **Body**             | `{ "username":"", "password":"" }`              |
// | **Success response** | [200] `{ "username":"", "token":"" }`           |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }`    |
// | **Failure response** | [500] `{ "message": "Error: description" }`     |

// TODO Move logic to handler?
// TODO Apply authorization using a more selective mechanism
//  Currently it just checks endpoints physically below this one.
app.use((req, res, next) => {
    // TODO test
    if (!req.headers.authorization) {
        res.status(401);
        res.send(new ErrorResponse("No credentials provided"));
    } else {
        const token = req.headers.authorization;
        if (!dataAccessObjects.authDAO.isValidToken(token)) {
            res.status(401);
            res.send(new ErrorResponse("Could not authenticate; an invalid token was provided"));
        } else {
            next();
        }
    }
});

// get stats
app.get('/stats', jsonParser, (req, res) => {
    // TODO test
    handleResponse(res, () => {
        return services.getStatsService.getStats(req.body);
    })
})

//  Logout
app.delete('/session', (req, res) => {
    // TODO test
    handleResponse(res, () => {
        return services.logoutService.logout(req.headers.authorization);
    });
});
// | **Request class**    | N/A (no request body)                        |
// | **Response class**   | MessageResponse                              |
// | **Description**      | Logs out the user represented by the token.  |
// | **Headers**          | `authorization: <token>`                     |
// | **Success response** | [200]                                        |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`  |

//  Join Game
app.post('/game', jsonParser, (req, res) => {
    // TODO test
    handleResponse(res, () => {
        return services.joinGameService.joinGame(req.body);

    });
});
// | **Request class**    | JoinGameRequest                                                                                                                                                                            |
// | **Response class**   | MessageResponse                                                                                                                                                                            |
// | **Description**      | If a game with the specified players exists, joins the game. Otherwise, if a game request exists, a new (empty) game is created and WS requests are sent. Otherwise, a request is created. |
// | **Headers**          | `authorization: <authToken>`                                                                                                                                                               |
// | **Body**             | `{ "player":"playerName", "opponent": "opponentName", "firstPlayer": "playerName" }`                                                                                                       |
// | **Success response** | [200] `{ "message": "OK", "board": <boardState> }`                                                                                                                                         |
// | **Failure response** | [400] `{ "message": "Error: bad request" }`                                                                                                                                                |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }`                                                                                                                                               |
// | **Failure response** | [403] `{ "message": "Error: already taken" }`                                                                                                                                              |
// | **Failure response** | [500] `{ "message": "Error: description" }`                                                                                                                                                |

module.exports = app;
