const {ErrorResponse} = require("./http");
const database = require("./database");
const config = require("../config.json");

function setAuthCookie(res, token) {
    res.cookie(config.cookie.authCookieName, token, {
        sameSite: 'strict', httpOnly: true, secure: true
    });
}

function getAuthCookie(req) {
    return req.cookies[config.cookie.authCookieName];
}

function clearAuthCookie(res) {
    res.clearCookie(config.cookie.authCookieName);
}

function stripSecureInfo(obj) {
    const secureKeys = ['password', 'token'];
    const safeObj = JSON.parse(JSON.stringify(obj))
    for (let key of secureKeys) {
        if (safeObj[key]) {
            safeObj[key] = 'X';
        }
    }
    return safeObj;
}

async function requireAuthCookie(req, res, next) {
    console.log('Hit middleware: requireAuthCookie for secure endpoints');

    const tokenString = getAuthCookie(req);
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
        res.clearCookie(config.cookie.authCookieName);
        res.status(401).send(new ErrorResponse("Could not authenticate; an invalid token was provided"));
    }
}

module.exports = {clearAuthCookie, setAuthCookie, getAuthCookie, requireAuthCookie, stripSecureInfo};