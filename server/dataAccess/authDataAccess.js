'use strict';

// Auth Data Access
// TODO! db

/**
 * Registers the given token as a valid token.
 *
 * @param token the AuthToken to register
 */
function addToken(token) {

}

/**
 * Checks if the given token is currently valid.
 *
 * @param token the token to validate
 * @return true iff the given token is currently valid
 */
function isValidToken(token) {
    return true;
}

/**
 * Invalidates the given token. Future calls requiring authorization for the given user will need to
 * generate a new token by re-authenticating.
 *
 * @param token the token to invalidate
 */
function removeToken(token) {

}

/**
 * Invalidates every currently valid token. Future calls requiring authorization will need to generate
 * new tokens by re-authenticating.
 */
function clearTokens() {

}

export {addToken, isValidToken, removeToken, clearTokens};
