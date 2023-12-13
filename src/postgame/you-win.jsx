import React from 'react';
import {NavLink} from "react-router-dom";

export function YouWin() {
    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-around align-items-center">
        {/* TODO. css: Move the chicken for 150% size */}
        <div></div>

        <h1 className="text-center" style={{fontSize: 50, fontStyle: "italic"}}>YOU WON!!!</h1>

        <div className="d-flex flex-column justify-content-center align-items-center">
            <p className="text-center">Oh. Well, that's something, I guess. Here's a congratulatory chicken.</p>
            <p className="">🐔</p>
        </div>

        <NavLink className="btn btn-success" to='/home'>Play again!</NavLink>

        <div></div>
    </main>);
}