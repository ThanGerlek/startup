'use strict';

// TODO server: wait-for-friend.js

    // let params = new URLSearchParams(location.search);
    // let receiverUsername = params.get('requestreceiveruser');

function onLoad() {
    window.redirectTimeout = setTimeout(redirectToBoard, 5000);
}

function onNevermindButtonClick() {
    cancelRedirect();
    localStorage.removeItem('opponentUsername');
    window.location.href = "home.html";
}

function redirectToBoard() {
    window.location.href = "game.html";
}

function cancelRedirect()  {
    clearTimeout(window.redirectTimeout);
}

document.addEventListener('DOMContentLoaded', onLoad);
document.getElementById('never-mind-button').addEventListener('click', onNevermindButtonClick);
