import React from 'react';

export function YouLose() {
    return (
        <main className="mx-3 flex-grow-1 d-flex flex-column justify-content-around align-items-center">
            <div></div>

            <h1 className="text-center" style={{fontSize: 50, fontStyle: "italic"}}>YOU LOST!!!</h1>

            <p className="text-center">You must be horribly ashamed. But don't worry, maybe you can redeem yourself and restore
                honor to your family.</p>

            <a className="btn btn-success" href="../../public/home.html">Play again!</a>

            {/* TODO make this nicer-looking */}
            <p className="text-center" id="quote">Bob</p>

            <div></div>
        </main>
    );
}