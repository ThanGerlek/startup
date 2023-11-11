const {
    UnauthorizedAccessError, BadRequestError, NoSuchItemError, ValueAlreadyTakenError, DataAccessError
} = require("./dataAccess/dataAccess");
const {ErrorResponse} = require("./http");

handleResponse = function (res, runService) {
    try {
        const response = runService();
        res.send(response);
    } catch (e) {
        /*
        400 BadRequestError, NoSuchItemError, ValueAlreadyTakenError
        403 UnauthorizedAccessError
        500 DataAccessError
        */
        if (e instanceof BadRequestError || e instanceof NoSuchItemError || e instanceof ValueAlreadyTakenError) {
            res.status(400);
            res.send(new ErrorResponse(e.message));
        } else if (e instanceof UnauthorizedAccessError) {
            res.status(403);
            res.send(new ErrorResponse(e.message));
        } else if (e instanceof DataAccessError) {
            res.status(500);
            res.send(new ErrorResponse(e.message));
        } else {
            res.status(500);
            res.send(new ErrorResponse(`Unrecognized server error`, e))
        }
    }
}

module.exports = {handleResponse};