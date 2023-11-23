'use strict';

async function getQuote() {
    return await fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(jsonResponse => {
            const text = jsonResponse.content;
            const author = jsonResponse.author;
            return `"${text}" (${author})`
        });
}

document.getElementById('quote').textContent = await getQuote();