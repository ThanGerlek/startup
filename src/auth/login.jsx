import React from 'react';

export function Login() {
    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <div>
            <h3>Welcome!</h3>
            <p>Please log in to play.</p>
        </div>

        <div className="d-flex flex-column align-items-center">

            {/* TODO. html: align user and pass text boxes (switch to grid design? flex-shrink?) */}
            {/* TODO. html: labels and text boxes become left-aligned with a very thin screen (they also collapse at different points because they're slightly different widths) */}
            <div className="my-2 justify-content-between">
                <label htmlFor="usernameBox">Username:</label>
                <input type="text" id="usernameBox" name="user"/>
            </div>

            <div className="my-2">
                <label htmlFor="passwordBox">Password: </label>
                <input type="password" id="passwordBox" name="pass"/>
            </div>

            <button id="login-button" className="btn btn-success my-2">Login</button>

            <button id="register-button" className="btn btn-link my-2">Create account</button>

            <div id="info_message" className="alert alert-info" style={{display: "none"}}></div>
            <div id="warn_message" className="alert alert-warning" style={{display: "none"}}></div>
            <div id="error_message" className="alert alert-danger" style={{display: "none"}}></div>
        </div>

        {/* TODO. Add forgot password button */}

    </main>);
}