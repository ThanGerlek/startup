'use strict';

// TODO Test if setting module.exports.clearApplication directly works properly.
// Specifically, when calling other functions defined in clearApplication.js.
// The alternative is `m.e.cA = function () {return clearApplication();}` which might
// work better or might be exactly the same.

module.exports.clearApplication = function () {
    // TODO! services
    console.log("Called clearApplication()");
}

// | **Request class**    | N/A (no request body)                                          |
// | **Response class**   | MessageResponse                                                |
// | **Description**      | Clears the database. Removes all users, games, and authTokens. |
// | **Success response** | [200]                                                          |
// | **Failure response** | [500] `{ "message": "Error: description" }`                    |
