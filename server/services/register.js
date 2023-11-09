'use strict';

const RegisterService = class {
    #authDAO;
    #gameDAO;
    #gameRequestDAO;
    #userDAO;

    constructor(authDAO, gameDAO, gameRequestDAO, userDAO) {
        this.#authDAO = authDAO;
        this.#gameDAO = gameDAO;
        this.#gameRequestDAO = gameRequestDAO;
        this.#userDAO = userDAO;
    }

    register() {
        // TODO! services
        console.log("Called register()");
    }
}

module.exports = RegisterService;

// | **Request class**    | RegisterRequest                               |
// | **Response class**   | AuthResponse                                  |
// | **Description**      | Register a new user.                          |
// | **Body**             | `{ "username":"", "password":"" }`            |
// | **Success response** | [200] `{ "username":"", "token":"" }`         |
// | **Failure response** | [400] `{ "message": "Error: bad request" }`   |
// | **Failure response** | [403] `{ "message": "Error: already taken" }` |
// | **Failure response** | [500] `{ "message": "Error: description" }`   |
