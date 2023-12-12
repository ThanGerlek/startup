import React from 'react';

export function FindFriendLocal() {
    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <h3>Start a game</h3>

        <p className="my-2 text-center">Hello, Player 2! What would you like your username to be?</p>

        <div className="my-2 d-flex flex-wrap align-items-center justify-content-center">

            <input type="text" id="otherUsernameBox" name="otherUser"/>
            <button id="submit-game-request-button" className="btn btn-success m-1">Go!</button>
        </div>

        <div id="info_message" className="alert alert-info" style={{display: "none"}}></div>
        <div id="warn_message" className="alert alert-warning" style={{display: "none"}}></div>
        <div id="error_message" className="alert alert-danger" style={{display: "none"}}></div>
    </main>);
}