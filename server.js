'use strict'

const dataAccess = require('./server/dataAccess/dataAccess').getNewDAOs();
const services = require('./server/services/services').getServicesFromDataSource(dataAccess);
const models = require('./server/models');

const express = require('express');
const app = express();

app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`req.originalUrl: '${req.originalUrl}', body: '${req.body}'`);
    next();
})


// Clear application
app.delete('/db', (req, res, next) => {
    // TODO(db)!
    services.clearApplicationService.clearApplication();
    res.send({message: "Okay!"});
});
// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Clears the database. Removes all users, games, and authTokens. |
// | **Success response** | [200]                                                          |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |


// Register
app.post('/user', (req, res, next) => {
    // TODO!
    services.registerService.register();
    res.send({message: "Okay!"});
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
app.post('/session', (req, res, next) => {
    // TODO!
    services.loginService.login();
    res.send({message: "Okay!"});
});
// | **Request class**    | LoginRequest                                    |
// | **Response class**   | AuthResponse                                    |
// | **Description**      | Logs in an existing user (returns a new token). |
// | **Body**             | `{ "username":"", "password":"" }`              |
// | **Success response** | [200] `{ "username":"", "token":"" }`           |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }`    |
// | **Failure response** | [500] `{ "message": "Error: description" }`     |


//  Logout
app.delete('/session', (req, res, next) => {
    // TODO!
    services.logoutService.logout();
    res.send({message: "Okay!"});
});
// | **Request class**    | N/A (no request body)                        |
// | **Response class**   | MessageResponse                              |
// | **Description**      | Logs out the user represented by the token.  |
// | **Headers**          | `authorization: <token>`                     |
// | **Success response** | [200]                                        |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`  |

//  Join Game
app.post('/game', (req, res, next) => {
    // TODO!
    services.joinGameService.joinGame();
    res.send({message: "Okay!"});
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