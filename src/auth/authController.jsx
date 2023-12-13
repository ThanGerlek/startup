import React from 'react';
import {
    cancelWaitNotification,
    clearMessageDisplay,
    displayMessage,
    setupWaitNotification
} from "../general/message-display.js";

export function AuthController({isLogin, login}) {
    const [isLoginPage, setIsLoginPage] = React.useState(isLogin);
    const redirectToRegister = () => setIsLoginPage(false);
    const redirectToLogin = () => setIsLoginPage(true);

    if (isLoginPage) {
        return <Login login={login} redirectToRegister={redirectToRegister}/>;
    } else {
        return <Register login={login} redirectToLogin={redirectToLogin}/>;
    }
}

function Login({login, redirectToRegister}) {
    const apiPath = "/api/session";
    const instructionText = "Please log in to play.";
    const primaryButtonLabel = "Login";
    const secondaryButton = {label: "Create account", callback: redirectToRegister};

    return <AuthPage login={login} instructionText={instructionText} apiPath={apiPath}
                     primaryButtonLabel={primaryButtonLabel}
                     secondaryButton={secondaryButton} showSecurityWarning={false}/>;
}

function Register({login, redirectToLogin}) {
    const apiPath = "/api/user";
    const instructionText = "Enter a username and password.";
    const primaryButtonLabel = "Create!";
    const secondaryButton = {label: "Back to login", callback: redirectToLogin};

    return <AuthPage login={login} instructionText={instructionText} apiPath={apiPath}
                     primaryButtonLabel={primaryButtonLabel}
                     secondaryButton={secondaryButton} showSecurityWarning={true}/>;
}

function AuthPage({login, instructionText, apiPath, primaryButton, secondaryButton, showSecurityWarning}) {

    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    function updateUsername(event) {
        event.preventDefault();
        setUsername(event.target.value);
    }

    function updatePassword(event) {
        event.preventDefault();
        setPassword(event.target.value);
    }

    function primaryButtonCallback() {
        clearMessageDisplay();
        setupWaitNotification();
        authenticate();
    }

    async function authenticate() {
        try {
            const response = await getAuthenticateResponse();
            cancelWaitNotification();
            parseResponse(response);
        } catch (err) {
            cancelWaitNotification();
            let msg = `Failed to connect to the server. Make sure you're connected to the internet, or try again later.`;
            displayMessage('error', msg);
        }
    }

    async function getAuthenticateResponse() {
        try {
            const response = await fetch(apiPath, {
                method: 'POST', body: JSON.stringify({
                    username: username, password: password
                }), headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            });
            return await response.json();
        } catch (e) {
            throw e;
        }
    }

    function parseResponse(response) {
        if (response.username) {
            loginUser(response.username);
        } else if (!response.message) {
            displayMessage('error', 'Failed to parse HTTP response!');
        } else {
            displayMessage('warn', response.message);
        }
    }

    function loginUser(username) {
        console.log(`Authenticated user: '${username}'`);
        displayMessage('info', 'Redirecting...');
        login(username);
    }


    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div>
            <h3>Welcome!</h3>
            <p>{instructionText}</p>
        </div>

        <div className="d-flex flex-column align-items-center">

            {/* TODO. html: align text boxes (switch to grid design? flex-shrink?) */}
            {/* TODO. html: labels and text boxes become left-aligned with a very thin screen (they also collapse at different points because they're slightly different widths) */}
            <div className="my-2 justify-content-between">
                <label htmlFor="usernameBox">Username:</label>
                <input type="text" id="usernameBox" onChange={updateUsername} name="user"/>
            </div>

            <div className="my-2">
                <label htmlFor="passwordBox">Password: </label>
                <input type="password" id="passwordBox" onChange={updatePassword} name="pass"/>
            </div>

            {/* TODO Add a second password box */}

            <button className="btn btn-success my-2" onSubmit={primaryButtonCallback}>{primaryButton.label}</button>

            <div className="align-items-center text-center my-2"
                 style={{display: showSecurityWarning ? "block" : "none"}}>
                <i><b>DO NOT USE A REAL PASSWORD.</b></i><br/>
                <i>This website was built by a college kid, not a security expert. It is NOT secure.</i>
            </div>

            <button className="btn btn-link my-2" onSubmit={secondaryButton.callback}>{secondaryButton.label}</button>

            <div id="info_message" className="alert alert-info" style={{display: "none"}}></div>
            <div id="warn_message" className="alert alert-warning" style={{display: "none"}}></div>
            <div id="error_message" className="alert alert-danger" style={{display: "none"}}></div>
        </div>

        {/* TODO. Add forgot password button */}

    </main>);
}