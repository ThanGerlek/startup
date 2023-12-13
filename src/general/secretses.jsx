import React from 'react';
import {NavLink} from "react-router-dom";

export function Secretses() {
    const routeNames = ["game", "find-friend-remote", "find-friend-local", "home", "login", "stats", "wait-for-friend", "you-lose", "you-win"];
    const routeLinks = routeNames.map(name => {
        return <li><NavLink className='btn btn-link' to={'/' + name}>{name}</NavLink></li>;
    });

    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-between align-items-center">
        <div className="pageDescription">
            <h3 className="pageTitle">You found the secretses!</h3>
            <p>This is just a test page with links to everything. It doesn't have admin privileges or anything like
                that, it's just a shortcut.
            </p>
        </div>

        <nav>
            <menu>
                {routeLinks}
            </menu>
        </nav>

        <div></div>
    </main>);
}