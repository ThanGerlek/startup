'use strict';

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
            res.status(400).send(new ErrorResponse(e.message, e));
        } else if (e instanceof UnauthorizedAccessError) {
            res.status(403).send(new ErrorResponse(e.message, e));
        } else if (e instanceof DataAccessError) {
            res.status(500).send(new ErrorResponse(e.message, e));
        } else {
            res.status(500).send(new ErrorResponse(`Unrecognized server error`, e))
        }
    }
}

module.exports = {handleResponse};