'use strict';

import {onAuthenticateButtonClick} from "./auth.mjs";

document.getElementById('register-button').addEventListener('click', () => {
    onAuthenticateButtonClick('/user')
});
document.getElementById('login-button').addEventListener('click', () => {
    window.location.href = 'login.html';
});
