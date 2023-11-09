'use strict';

const LoginService = class {
    #authDAO;
    #userDAO;

    constructor(authDAO, userDAO) {
        this.#authDAO = authDAO;
        this.#userDAO = userDAO;
    }

    login() {
        // TODO! services
        console.log("Called login()");
    }
}

module.exports = LoginService;

// | **Request class**    | LoginRequest                                    |
// | **Response class**   | AuthResponse                                    |
// | **Description**      | Logs in an existing user (returns a new token). |
// | **Body**             | `{ "username":"", "password":"" }`              |
// | **Success response** | [200] `{ "username":"", "token":"" }`           |
// | **Failure response** | [401] `{ "message": "Error: unauthorized" }`    |
// | **Failure response** | [500] `{ "message": "Error: description" }`     |
