import React from 'react';

export function YouWin() {
    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-around align-items-center">
        {/* TODO. css: Move the chicken for 150% size */}
        <div></div>

        <h1 className="text-center" style={{fontSize: 50, fontStyle: "italic"}}>YOU WON!!!</h1>

        <div className="d-flex flex-column justify-content-center align-items-center">
            <p className="text-center">Oh. Well, that's something, I guess. Here's a congratulatory chicken.</p>
            <p className="">🐔</p>
        </div>

        <a className="btn btn-success" href="../../public/home.html">Play again!</a>

        <div></div>
    </main>);
}