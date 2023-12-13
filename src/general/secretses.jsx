import React from 'react';
import {NavLink} from "react-router-dom";

export function Secretses() {
    return (
        <main className="mx-3 flex-grow-1 d-flex flex-column justify-content-between align-items-center">
            <div className="pageDescription">
                <h3 className="pageTitle">You found the secretses!</h3>
                <p>This is just a test page with links to everything. It doesn't have admin privileges or anything like
                    that, it's just a shortcut.
                </p>
            </div>

            <nav>
                <menu>
                    <NavLink className='nav-link' to='/game'>game</NavLink>
                    <NavLink className='nav-link' to='/find-friend-remote'>find-friend-remote</NavLink>
                    <NavLink className='nav-link' to='/find-friend-local'>find-friend-local</NavLink>
                    <NavLink className='nav-link' to='/home'>home</NavLink>
                    <NavLink className='nav-link' to='/login'>login</NavLink>
                    <NavLink className='nav-link' to='/stats'>stats</NavLink>
                    <NavLink className='nav-link' to='/wait-for-friend'>wait-for-friend</NavLink>
                    <NavLink className='nav-link' to='/you-lose'>you-lose</NavLink>
                    <NavLink className='nav-link' to='/you-win'>you-win</NavLink>
                </menu>
            </nav>

            <div></div>
        </main>
    );
}