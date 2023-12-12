'use strict';

import {onAuthenticateButtonClick} from "./auth.mjs";

document.getElementById('login-button').addEventListener('click', () => {
    onAuthenticateButtonClick('/session');
});
document.getElementById('register-button').addEventListener('click', () => {
    window.location.href = 'register.html';
});
