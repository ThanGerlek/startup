import React from 'react';
import {BrowserRouter, Navigate, NavLink, Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {Home} from "./home/home.jsx";
import {GameController} from "./pregame/game-controller.jsx";
import {AuthController} from "./auth/authController.jsx";
import {sendLogoutRequest} from "./auth/require-auth.js";
import {WaitForFriend} from "./pregame/wait-for-friend.jsx";
import {YouLose} from "./postgame/you-lose.jsx";
import {YouWin} from "./postgame/you-win.jsx";
import {Game} from "./game/game.jsx";
import {Stats} from "./stats/stats.jsx";
import {Secretses} from "./general/secretses.jsx";

function App() {
    const [sessionData, setSessionData] = React.useState({});

    function login(username) {
        const newSessionData = {...sessionData, username: username};
        setSessionData(newSessionData);
    }

    function logout() {
        setSessionData({});
        window.location.href = 'login';
    }

    function isLoggedIn() {
        return !!sessionData.username;
    }

    return (<BrowserRouter>
        <div className="fullSize bg-light d-flex flex-column">
            <header
                className="container-fluid my-2 align-items-center justify-content-between d-flex flex-wrap border-bottom">
                <div></div>
                <NavLink className="text-dark text-decoration-none" to='/home'>
                    <h1>NIM Player</h1>
                </NavLink>
                <ul className="nav">
                    <li>
                        <LogoutButton isLoggedIn={isLoggedIn()} logoutSessionData={logout}/>
                    </li>
                </ul>
            </header>

            <Routes>
                <Route path='/' element={<Navigate to='/home'/>} exact/>
                <Route path='/secretses' element={<Secretses/>}/>

                <Route path='/login'
                       element={<AuthController isLogin={true} login={login} isInitiallyLoggedIn={isLoggedIn()}/>}/>
                <Route path='/register'
                       element={<AuthController isLogin={false} login={login} isInitiallyLoggedIn={isLoggedIn()}/>}/>

                <Route path='/find-friend-remote' element={<RequireAuth isLoggedIn={isLoggedIn} element=
                    {<GameController username={sessionData.username} gameType="remote"/>}
                />}/>
                <Route path='/find-friend-local' element={<RequireAuth isLoggedIn={isLoggedIn} element=
                    {<GameController username={sessionData.username} gameType="local"/>}
                />}/>
                <Route path='/wait-for-friend' element={<RequireAuth isLoggedIn={isLoggedIn} element=
                    {<WaitForFriend/>}
                />}/>

                <Route path='/game' element={<RequireAuth isLoggedIn={isLoggedIn} element={<Game/>}/>}/>
                <Route path='/home' element={<RequireAuth isLoggedIn={isLoggedIn} element={<Home/>}/>}/>
                <Route path='/stats' element={<RequireAuth isLoggedIn={isLoggedIn} element={<Stats/>}/>}/>
                <Route path='/you-lose' element={<RequireAuth isLoggedIn={isLoggedIn} element={<YouLose/>}/>}/>
                <Route path='/you-win' element={<RequireAuth isLoggedIn={isLoggedIn} element={<YouWin/>}/>}/>


                <Route path='*' element={<NotFound/>}/>
            </Routes>

            <footer className="container-fluid mt-auto my-3 d-flex justify-content-between border-top">
                <p>A simple web app by Nathaniel Gerlek.</p>
                <a className="btn btn-link text-decoration-none"
                   href="https://github.com/ThanGerlek/startup">GitHub</a>
            </footer>
        </div>
    </BrowserRouter>);
}

function NotFound() {
    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-between align-items-center">
        404: Return to sender. Address unknown.
    </main>);
}

function LogoutButton({isLoggedIn, logoutSessionData}) {
    const label = isLoggedIn ? "Logout" : "Login";

    function handleButtonClick(event) {
        event.preventDefault();
        if (isLoggedIn) {
            logout();
        }
    }

    function logout() {
        console.log("Logging out");
        sendLogoutRequest();
        logoutSessionData();
        // TODO? logoutSessionData() only after request succeeds
    }

    return <button className="btn d-flex text-dark text-decoration-none" onClick={handleButtonClick}>{label}</button>;
}

function RequireAuth({isLoggedIn, element}) {
    if (isLoggedIn()) {
        return element;
    } else {
        return <Navigate to="/login" replace/>;
    }
}

export default App;
