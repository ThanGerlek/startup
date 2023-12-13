const {
    UnauthorizedAccessError, BadRequestError, NoSuchItemError, ValueAlreadyTakenError, DataAccessError
} = require("./dataAccess/dataAccess");
const {ErrorResponse} = require("./http");

function handleResponseError(res, e) {
    /*
    400 BadRequestError
    401 UnauthorizedAccessError (technically "unauthenticated"; 403 would be "unauthorized")
    404 NoSuchItemError
    409 ValueAlreadyTakenError
    500 DataAccessError
    */
    console.log(`[Error] ${e.message}`);
    if (e instanceof BadRequestError) {
        res.status(400).send(new ErrorResponse(e.message, e));
    } else if (e instanceof UnauthorizedAccessError) {
        res.status(401).send(new ErrorResponse(e.message, e));
    } else if (e instanceof NoSuchItemError) {
        res.status(404).send(new ErrorResponse(e.message, e));
    } else if (e instanceof ValueAlreadyTakenError) {
        res.status(409).send(new ErrorResponse(e.message, e));
    } else if (e instanceof DataAccessError) {
        res.status(500).send(new ErrorResponse(e.message, e));
    } else {
        res.status(500).send(new ErrorResponse(`Unrecognized server error: ${e.message}`, e))
    }
}

module.exports = {handleResponseError};