'use strict';

const {ErrorResponse} = require("./http");
const database = require("./database");
const config = require("../config.json");

function setAuthCookie(res, token) {
    res.cookie(config.cookie.authCookieName, token, {
        sameSite: 'strict', httpOnly: true, secure: true
    });
}

function stripSecureInfo(obj) {
    const safeObj = JSON.parse(JSON.stringify(obj))
    delete safeObj.password;
    return safeObj;
}

async function requireAuthCookie(req, res, next) {
    const tokenString = req.cookies[config.cookie.authCookieName];
    if (!tokenString) {
        res.status(401).send(new ErrorResponse("No credentials provided"));
        return;
    }

    const isValid = await database.connectAndRun((dataAccessManager) => {
        const authDAO = dataAccessManager.getAuthDAO();
        return authDAO.isValidToken(tokenString);
    });

    if (isValid) {
        next();
    } else {
        res.status(401).send(new ErrorResponse("Could not authenticate; an invalid token was provided"));
        res.clearCookie(config.cookie.authCookieName);
    }
}

module.exports = {setAuthCookie, stripSecureInfo, requireAuthCookie};