'use strict';

class DataAccessError extends Error {
}

class BadRequestError extends DataAccessError {
}

class NoSuchItemError extends DataAccessError {
}

class UnauthorizedAccessError extends DataAccessError {
}

class ValueAlreadyTakenError extends DataAccessError {
}

module.exports = {DataAccessError, BadRequestError, NoSuchItemError, UnauthorizedAccessError, ValueAlreadyTakenError};