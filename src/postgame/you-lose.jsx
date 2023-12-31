import React from 'react';
import {NavLink} from "react-router-dom";

export function YouLose() {

    const [quote, setQuote] = React.useState(null);

    React.useEffect(() => {
        getQuote();
    }, []);

    async function getQuote() {
        const quote = await fetch('https://api.quotable.io/random')
            .then(response => response.json())
            .then(jsonResponse => {
                const text = jsonResponse.content;
                const author = jsonResponse.author;
                return `"${text}" (${author})`
            });
        setQuote(quote);
    }

    return (<main className="mx-3 flex-grow-1 d-flex flex-column justify-content-around align-items-center">
        <div></div>
        <h1 className="text-center" style={{fontSize: 50, fontStyle: "italic"}}>YOU LOST!!!</h1>
        <p className="text-center">You must be horribly ashamed. But don't worry, maybe you can redeem yourself and
            restore honor to your family.</p>
        <NavLink className="btn btn-success" to='/home'>Play again!</NavLink>
        {/* TODO make this nicer-looking */}
        <p className="text-center" id="quote">{quote}</p>
        <div></div>
    </main>);
}