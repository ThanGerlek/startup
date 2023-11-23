'use strict';

const {MessageResponse} = require('../http');

class JoinGameService {
    #gameDAO;
    #gameRequestDAO;
    #userDAO;

    constructor(dataAccessManager) {
        this.#gameDAO = dataAccessManager.getGameDAO();
        this.#gameRequestDAO = dataAccessManager.getGameRequestDAO();
        this.#userDAO = dataAccessManager.getUserDAO();
    }

    // If a game with the specified players exists, joins the game and
    // returns the gameID. Otherwise, if a game request exists, a new
    // (empty) game is created and WS requests are sent. If a request
    // does not exist, a request is created.

    // Game + req: join game
    // Game + no req: join game
    // No game + request: create game, delete request
    // No game + no req: create request

    joinGame(joinGameRequest) {
        // TODO! services
        console.log("Called joinGame()");

        return new MessageResponse("Joined game.");
    }
}

module.exports = {JoinGameService};

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
