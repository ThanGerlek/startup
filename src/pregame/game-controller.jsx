import React from 'react';
import {displayMessage} from "../general/message-display.js";
import {DEFAULT_BOARD_DIMENSIONS} from "../game/board.mjs";
import {Game} from "../game/game.jsx";

export function GameController({username, gameType}) {
    const [isGameActive, setIsGameActive] = React.useState(false);
    const [gameData, setGameData] = React.useState(null);

    function startGame(newGameData) {
        setGameData(newGameData);
        setIsGameActive(true);
    }

    if (isGameActive) {
        return <Game gameData={gameData}/>;
    } else if (gameType === 'local') {
        return <FindFriendLocal playerUsername={username} startGame={startGame}/>;
    } else {
        return <FindFriendRemote playerUsername={username} startGame={startGame}/>;
    }
}

export function FindFriendLocal({playerUsername, startGame}) {
    const opponentPrompt = "Hello, Player 2! What would you like your username to be?";
    const sameNameWarning = "Woah! That's your friend's name! Please try something else.";
    return <FindFriend playerUsername={playerUsername} startGame={startGame} opponentPrompt={opponentPrompt}
                       sameNameWarning={sameNameWarning} gameType="local"/>
}

export function FindFriendRemote({playerUsername, startGame}) {
    const opponentPrompt = "Enter the username of a friend you want to play with.";
    const sameNameWarning = "Enter your opponent's username, not yours.";

    // TODO implement waitForFriend and pass that instead of startGame

    return <FindFriend playerUsername={playerUsername} startGame={startGame} opponentPrompt={opponentPrompt}
                       sameNameWarning={sameNameWarning} gameType="remote"/>
}

export function FindFriend({playerUsername, startGame, opponentPrompt, sameNameWarning, gameType}) {

    const [opponentUsername, setOpponentUsername] = React.useState('');

    function handleChange(event) {
        setOpponentUsername(event.target.value);
    }

    function handleButtonClick() {
        if (opponentUsername === "") {
            displayMessage('warn', 'Please enter a username.');
        } else if (opponentUsername === playerUsername) {
            displayMessage('warn', sameNameWarning);
        } else {
            const gameData = generateGameData(playerUsername, opponentUsername);
            startGame(gameData);
        }
    }

    function generateGameData(playerUsername, opponentUsername) {
        return {
            players: [playerUsername, opponentUsername], currentPlayer: playerUsername, // TODO allow switching who goes first
            board: generateNewBoardArray(), gameType: gameType,
        };
    }

    function generateNewBoardArray() {
        const boardArray = [];
        DEFAULT_BOARD_DIMENSIONS.forEach(rowSize => {
            const row = [];
            for (let i = 0; i < rowSize; i++) {
                row.push(false);
            }
            boardArray.push(row);
        });
        return boardArray;
    }

    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
        <h3>Start a game</h3>
        <p className="my-2 text-center">{opponentPrompt}</p>
        <div className="my-2 d-flex flex-wrap align-items-center justify-content-center">
            <input type="text" name="opponentUsername" onChange={handleChange}/>
            <button className="btn btn-success m-1" onClick={handleButtonClick}>Go!</button>
        </div>

        <div id="info_message" className="alert alert-info" style={{display: "none"}}></div>
        <div id="warn_message" className="alert alert-warning" style={{display: "none"}}></div>
        <div id="error_message" className="alert alert-danger" style={{display: "none"}}></div>
    </main>);
}