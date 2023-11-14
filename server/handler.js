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
            res.send(400, new ErrorResponse(e.message));
        } else if (e instanceof UnauthorizedAccessError) {
            res.send(403, new ErrorResponse(e.message));
        } else if (e instanceof DataAccessError) {
            res.send(500, new ErrorResponse(e.message));
        } else {
            res.send(500, new ErrorResponse(`Unrecognized server error`, e))
        }
    }
}

module.exports = {handleResponse};