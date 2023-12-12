import React from 'react';

export function Register() {
    return (
        <main className="mx-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div>
                <h3>Welcome!</h3>
                <p>Enter a username and password.</p>
            </div>

            <div className="d-flex flex-column align-items-center">

                {/* TODO. html: align text boxes (switch to grid design? flex-shrink?) */}
                {/* TODO. html: labels and text boxes become left-aligned with a very thin screen (they also collapse at different points because they're slightly different widths) */}
                <div className="my-2 justify-content-between">
                    <label htmlFor="usernameBox">Username:</label>
                    <input type="text" id="usernameBox" name="user" />
                </div>

                <div className="my-2">
                    <label htmlFor="passwordBox">Password: </label>
                    <input type="password" id="passwordBox" name="pass" />
                </div>

                {/* TODO Add a second password box */}

                <button id="register-button" className="btn btn-success my-2">Create!</button>

                <button id="login-button" className="btn btn-link my-2">Back to login</button>

                <div className="align-items-center text-center my-2">
                    <i><b>DO NOT USE A REAL PASSWORD.</b></i><br/>
                    <i>This website was built by a college kid, not a security expert. It is NOT secure.</i>
                </div>

                <div id="info_message" className="alert alert-info" style={{display: "none"}}></div>
                <div id="warn_message" className="alert alert-warning" style={{display: "none"}}></div>
                <div id="error_message" className="alert alert-danger" style={{display: "none"}}></div>
            </div>

        </main>
    );
}