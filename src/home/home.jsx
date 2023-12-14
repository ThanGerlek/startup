import React from 'react';
import {NavLink} from "react-router-dom";

export function Home() {
    // TODO test: set up UI testing
    //  https://github.com/webprogramming260/.github/blob/main/profile/webServices/uiTesting/uiTesting.md-->

    // TODO. html: Add Home link to header bar
    // TODO js: generate button click events with JS, not HTML

    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        {/* TODO. html: remove images when stacked (switch to grid design? */}
        {/* TODO? html: widen columns based on how much text I put into the buttons? */}
        <div className="container d-flex" style={{maxWidth: 450}}>
            <div className="container d-flex flex-column justify-content-between align-items-center">
                <div className="align-items-center justify-content-center text-center">
                    <NavLink className="btn btn-success" to='/find-friend-remote'>Play with a friend online!</NavLink>
                </div>
                <div className="my-3 align-items-center justify-content-center">
                    <img src="15-75-matchstick.png" alt="matchstick"/>
                </div>
            </div>
            <div className="container d-flex flex-column justify-content-between align-items-center">
                <div className="align-items-center justify-content-center">
                    <img src="15-75-matchstick.png" alt="matchstick"/>
                </div>
                <div className="my-3 align-items-center justify-content-center text-center">
                    <NavLink className="btn btn-success" to='/stats'>See your stats!</NavLink>
                </div>
            </div>
            <div className="container d-flex flex-column justify-content-between align-items-center">
                <div className="align-items-center justify-content-center text-center">
                    <NavLink className="btn btn-success" to='/find-friend-local'>Play locally on this device!</NavLink>
                </div>
                <div className="my-3 align-items-center justify-content-center">
                    <img src="15-75-matchstick.png" alt="matchstick"/>
                </div>
            </div>
        </div>

        {/* TODO html: How To Play page */}

    </main>);
}