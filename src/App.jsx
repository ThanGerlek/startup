import 'bootstrap/dist/css/bootstrap.min.css';
import {useWindowDimensions} from 'react-native';

function App() {
    const {height} = useWindowDimensions();

    return (<div className="bg-light d-flex flex-column" style={{minHeight: height}}>
        <header
            className="container-fluid my-2 align-items-center justify-content-between d-flex flex-wrap border-bottom">
            <div></div>
            <a href="../public/home.html" className="text-dark text-decoration-none">
                <h1>NIM Player</h1>
            </a>
            <ul className="nav">
                <li>
                    <button id="logout-button" className="btn d-flex text-dark text-decoration-none">Logout</button>
                </li>
            </ul>
        </header>

        <main className="mx-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            App components go here
        </main>

        <footer className="container-fluid mt-auto my-3 d-flex justify-content-between border-top">
            <p>A simple web app by Nathaniel Gerlek.</p>
            <a className="btn btn-link text-decoration-none" href="https://github.com/ThanGerlek/startup">GitHub</a>
        </footer>
    </div>);
}

export default App;
