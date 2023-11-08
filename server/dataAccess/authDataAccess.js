'use strict';

// Auth Data Access
// TODO! db

let AuthDAO = class {

    /**
     * Registers the given token as a valid token.
     *
     * @param token the AuthToken to register
     */
    addToken(token) {
        // TODO
    }

    /**
     * Checks if the given token is currently valid.
     *
     * @param token the token to validate
     * @return true iff the given token is currently valid
     */
    isValidToken(token) {
        // TODO
        return true;
    }

    /**
     * Invalidates the given token. Future calls requiring authorization for the given user will need to
     * generate a new token by re-authenticating.
     *
     * @param token the token to invalidate
     */
    removeToken(token) {
        // TODO
    }

    /**
     * Invalidates every currently valid token. Future calls requiring authorization will need to generate
     * new tokens by re-authenticating.
     */
    clearTokens() {
        // TODO
    }
}

module.exports = AuthDAO;