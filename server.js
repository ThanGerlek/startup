'use strict'

const {ErrorResponse} = require('./server/http')
const {handleResponse} = require("./server/handler");

const {DataAccessManager} = require('./server/dataAccess/dataAccess');
const {MongoClient} = require("mongodb");
const config = require("./dbConfig.json");
const services = require('./server/services/services');

const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`Received request: ${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    next();
});


function mongoURL() {
    return `mongodb+srv://${config.username}:${config.password}@${config.hostname}`;
}


async function connectToDatabaseAndRun(callback) {
    const client = new MongoClient(mongoURL());
    await client.connect();
    try {
        const db = client.db(config.dbName);
        const dataAccessManager = new DataAccessManager(db);
        return callback(dataAccessManager);
    } finally {
        await client.disconnect();
    }
}

// Clear application
app.delete('/db', (req, res) => {
    // TODO test
    handleResponse(res, async () => {
        await connectToDatabaseAndRun((dataAccessManager) => {
            const service = new services.ClearApplicationService(dataAccessManager);
            return service.clearApplication();
        });
    });
});
// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Clears the database. Removes all users, games, and authTokens. |
// | **Success response** | [200]                                                          |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |


// Register
app.post('/user', (req, res) => {
    // TODO test
    handleResponse(res, async () => {
        await connectToDatabaseAndRun((dataAccessManager) => {
            const service = new services.RegisterService(dataAccessManager);
            return service.register(req.body);
        });
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
app.post('/session', (req, res) => {
    // TODO test
    handleResponse(res, async () => {
        await connectToDatabaseAndRun((dataAccessManager) => {
            const service = new services.LoginService(dataAccessManager);
            return service.login(req.body);
        });
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
// TODO? recycle DB connection?
app.use(async (req, res, next) => {
    // TODO test
    if (!req.headers.authorization) {
        res.status(401).send(new ErrorResponse("No credentials provided"));
        return;
    }

    const token = req.headers.authorization;

    const client = new MongoClient(mongoURL());
    await client.connect();
    try {
        const db = client.db(config.dbName);
        const authDAO = new DataAccessManager(db).getAuthDAO();
        const isValid = await authDAO.isValidToken(token);

        if (!isValid) {
            res.status(401).send(new ErrorResponse("Could not authenticate; an invalid token was provided"));
            return;
        }

    } finally {
        client.close();
    }

    next();
});

//  Authenticate token
// TODO Delete and replace with real authentication
app.get('/session', (req, res) => {
    handleResponse(res, async () => {
        await connectToDatabaseAndRun((dataAccessManager) => {
            const service = new services.AuthenticateService(dataAccessManager);
            return service.authenticateToken(req.headers.authorization);
        });
    });
});

// get stats
app.get('/stats', (req, res) => {
    // TODO test
    handleResponse(res, async () => {
        await connectToDatabaseAndRun((dataAccessManager) => {
            const service = new services.GetStatsService(dataAccessManager);
            return service.getStats(req.body);
        })
    });
});

//  Logout
app.delete('/session', (req, res) => {
    // TODO test
    handleResponse(res, async () => {
        await connectToDatabaseAndRun((dataAccessManager) => {
            const service = new services.LogoutService(dataAccessManager);
            return service.logout(req.headers.authorization);
        });
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
app.post('/game', (req, res) => {
    // TODO test
    handleResponse(res, async () => {
        await connectToDatabaseAndRun((dataAccessManager) => {
            const service = new services.JoinGameService(dataAccessManager);
            return service.joinGame(req.body);
        });
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
