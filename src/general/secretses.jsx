import React from 'react';

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
                    <li><a href="../../public/game.html">game.html</a></li>
                    <li><a href="../../public/find-friend-remote.html">find-friend.html</a></li>
                    <li><a href="../../public/find-friend-local.html">find-friend.html</a></li>
                    <li><a href="../../public/home.html">home.html</a></li>
                    <li><a href="../../public/index.html">index.html</a></li>
                    <li><a href="../../public/login.html">login.html</a></li>
                    <li><a href="../../public/stats.html">stats.html</a></li>
                    <li><a href="../../public/wait-for-friend.html">wait-for-friend.html</a></li>
                    <li><a href="../../public/you-lose.html">you-lose.html</a></li>
                    <li><a href="../../public/you-win.html">you-win.html</a></li>
                </menu>
            </nav>

            <div></div>
        </main>
    );
}