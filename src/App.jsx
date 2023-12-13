import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useWindowDimensions} from 'react-native';
import {Home} from "./home/home.jsx";
import {FindFriendRemote} from "./pregame/find-friend-remote.jsx";
import {FindFriendLocal} from "./pregame/find-friend-local.jsx";
import {Login} from "./auth/login.jsx";
import {Register} from "./auth/register.jsx";
import {WaitForFriend} from "./pregame/wait-for-friend.jsx";
import {YouLose} from "./postgame/you-lose.jsx";
import {YouWin} from "./postgame/you-win.jsx";
import {Game} from "./game/game.jsx";
import {Stats} from "./stats/stats.jsx";

function App() {
    const {height} = useWindowDimensions();

    return (<BrowserRouter>
        <div className="bg-light d-flex flex-column" style={{minHeight: height}}>
            <header
                className="container-fluid my-2 align-items-center justify-content-between d-flex flex-wrap border-bottom">
                <div></div>
                <NavLink className="text-dark text-decoration-none" to='/home'>
                    <h1>NIM Player</h1>
                </NavLink>
                <ul className="nav">
                    <li>
                        <button id="logout-button" className="btn d-flex text-dark text-decoration-none">Logout
                        </button>
                    </li>
                </ul>
            </header>

            <Routes>
                <Route path='/' element={<Home/>} exact/>
                <Route path='/find-friend-remote' element={<FindFriendRemote/>}/>
                <Route path='/find-friend-local' element={<FindFriendLocal/>}/>
                <Route path='/game' element={<Game/>}/>
                <Route path='/home' element={<Home/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/stats' element={<Stats/>}/>
                <Route path='/wait-for-friend' element={<WaitForFriend/>}/>
                <Route path='/you-lose' element={<YouLose/>}/>
                <Route path='/you-win' element={<YouWin/>}/>
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

export default App;
