function onLoad() {
    requireAuthentication();
}

export async function sendLogoutRequest() {
    await fetch('/api/session', {method: 'DELETE'})
        .then(r => r.json())
        .then(r => {
            console.log('Logged out successfully...?');
            console.log(JSON.stringify(r));
        })
        .catch(e => {
        console.log(`Failed to connect to server: ${e.message}`);
    });
    console.log('Finished logging out.');
}

function requireAuthentication() {
    fetch('/api/secure/me')
        .then(r => r.json())
        .then(response => {
            console.log(response);
            if (!response.authenticated) {
                failToAuthenticate('No valid token was provided');
            } else {
                console.log('Found valid token');
            }
        })
        .catch(e => {
            console.log(`Failed to authenticate: ${e.message}`);
            failToAuthenticate(e.message);
        });
}

function failToAuthenticate(message) {
    console.log(`Failed to authenticate: ${message}`);
    window.location.href = 'login.html';
    localStorage.clear();
}
