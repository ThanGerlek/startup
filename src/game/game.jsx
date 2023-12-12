import React from 'react';

export function Game() {
    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-between align-items-center">
        {/* TODO. css: Shrink game buttons to better handle 150% size? Remove opponent name when they're too big? */}
        {/* TODO. html: Display "Make your move!" as a message, so there's always a box there, and replace with "waiting for opponent" when it's not the player's turn */}
        {/* TODO. css: Decide on turn highlighting */}

        {/* With back-and-forth highlighting */}

        <div className="container-fluid d-flex justify-content-between">
            <div className="btn btn-primary disabled">
                Make your move!
            </div>
            <div id="current-turn-username-box" className="btn btn-outline-primary disabled">
                George Washington
            </div>
        </div>

        {/*    ^^^ Player turn ^^^     VVV opponent turn VVV    */}

        {/* <div className="container-fluid d-flex justify-content-between">
                <div className="btn btn-outline-primary disabled">
                    Waiting for opponent
                </div>
                <div className="btn btn-primary disabled">
                    George Washington
                </div>
            </div> */}

        {/* With no adaptive highlighting */}

        {/* <div className="container-fluid d-flex justify-content-between">
                <div className="btn btn-outline-primary disabled">
                    Make your move!
                </div>
                <div className="btn btn-outline-primary disabled">
                    George Washington
                </div>
            </div> */}

        {/*    ^^^ Player turn ^^^     VVV opponent turn VVV    */}

        {/* <div className="container-fluid d-flex justify-content-between">
                <div className="btn btn-outline-primary disabled">
                    Waiting for opponent
                </div>
                <div className="btn btn-outline-primary disabled">
                    George Washington
                </div>
            </div> */}

        {/* end with */}


        <div className="container" id="board-container" style={{maxWidth: 400}}>
        </div>

        <div className="container-fluid d-flex justify-content-around">
            {/* TODO. css: Switch to check and reset icons */}
            <button type="button" id="submit-board-button" className="btn btn-success">Submit</button>
            <button type="button" id="reset-board-button" className="btn btn-dark">Reset</button>
        </div>

        <div id="info_message" className="alert alert-info" style={{display: "none"}}></div>
        <div id="warn_message" className="alert alert-warning" style={{display: "none"}}></div>
        <div id="error_message" className="alert alert-danger" style={{display: "none"}}></div>

        {/* TODO? css: Change other pages to match mt-3? */}
        {/* TODO. css: Make GitHub link vertically aligned with name text. */}
    </main>);
}