'use strict';

function stripSecureInfo(obj) {
    const safeObj = JSON.parse(JSON.stringify(obj))
    delete safeObj.password;
    return safeObj;
}

module.exports = {stripSecureInfo};