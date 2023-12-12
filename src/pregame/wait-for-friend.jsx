import React from 'react';

export function WaitForFriend() {
    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-around align-items-center">

        <div></div>
        <div></div>

        <div className="d-flex flex-column align-items-center">
            <h3 className="text-center">Waiting for response...</h3>
            <p className="text-center">Once your friend requests to play with you, the game will begin!</p>
        </div>

        <div></div>

        <div className="d-flex flex-column align-items-center">
            <button id="never-mind-button" className="btn btn-outline-success">Never mind</button>
        </div>

        <div></div>

    </main>);
}