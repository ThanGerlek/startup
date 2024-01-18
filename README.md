# NIM Player

A simple React webapp implementing the game of NIM, originally built for BYU's _CS260: Web Programming_ course. The current deployment is playable at (startup.gerleksgarage.click)[startup.gerleksgarage.click].

The app is hosted on an AWS EC2 instance with Caddy, using React and Bootstrap on the frontend and MongoDB and Express in the backend with Node.js. Peer-to-peer communication during gameplay is through websocket. Authentication uses the bcrypt library.

## React deliverable

Converted the entire webapp to a single-page React application. LocalStorage has been replaced by React state, HTML
pages have been replaced by `react-router-dom` routes, and most of the logic has been reorganized into React components.

- *Bundled using WebPack and Babel*: Check. Uses `create-react-app` to run the React server.
- *Multiple functional React components*: Check. Logic and state for authentication and navigation all use React
  components.
- *React router*: Check. Acts as a single-page application.
- *React hooks*: Check. WebSocket, 3rd party API calls, etc. are handled using React useEffect hooks.

Things still to be done include implementing the Stats page (which is still a placeholder), replacing the
vanilla-Javascript `messageDisplay` module with React components, and encapsulating session data so it can be more
easily passed between React elements. The gameboard itself is also still vanilla JS (it's implemented with ES6 classes,
and replacing it with React state completely would have required inverting the entire dependency tree, which I ran out
of time to do).

## WebSocket deliverable

Whenever a user joins a remote game, a WebSocket connection is created. The server tracks currently active games and
sends game updates (players joining, moves made, win conditions, etc.) to one or both players.

- *Frontend makes WebSocket connection*: Check.
- *Backend listens for WebSocket connection*: Check.
- *Backend listens for WebSocket connection*: Check.
- *Data sent over WebSocket connection*: Check.
- *WebSocket data displayed in the application interface*: Check (albeit indirectly; see below).

Note 1: I haven't had time to fix the bug in Note 2 from the Login deliverable, so follow those instructions when
creating both accounts.

Note 2, displaying WebSocket data: I don't have a chat system or anything, but of course the "current player turn" box
updates when your opponent makes a move. A more explicit example is that after player 1 creates a game, they are
notified when player 2 first joins.

## Login deliverable

- *Supports registration and authentication*: Check.
- *Stores credentials in MongoDB*: Check. All passwords are salted and hashed.
- *Restricts application functionality based on authentication*: Check. See below.

Note 1: The easiest ways to confirm restricted functionality are that
[the home page](https://startup.gerleksgarage.click/home.html) redirects back to the login page and
[this](https://startup.gerleksgarage.click/me) getCurrentUserData API call fails when logged out.

Note 2: there's currently a bug where alerts on the register page don't show up, so it won't warn you if you try to
register an invalid username or password. Just make sure neither is empty, they're not the same, and the password is at
least 12 characters.

## Database deliverable

Registered users and currently valid auth tokens persistently using MongoDB. This required a rewrite of essentially
everything except the HTML (no two of callbacks, jest, and async functions work well together, and trying to manage all
three simultaneously was a nightmare), which is a large part of why this deliverable is late. The other reason is that
I bit off more than I could chew--I've decided to only support local play for now. (Also the board doesn't currently
load. I'm working on that.)

- *MongoDB Atlas database*: Check.
- *Endpoints for data*: Check. Register, login, authenticateToken, and logout all access mongo.
- *Stores data in MongoDB* Check. User data and authentication tokens are stored persistently.

P.S. for the grader: it might be too late to change, but I was marked down on the Web Services deliverable because
the grader couldn't verify that I had working third-party service calls. (They were there, just not easily accessible
from the home screen.) However, if you click
[this link](https://startup.gerleksgarage.click/you-lose.html) after logging in, it will take you straight to that page.
You'll get a new quote every time you refresh.
[This](https://github.com/ThanGerlek/startup/commit/bdaed92fc62afefd74f460bf89b2c627263968ba) is the commit on GitHub
so you can verify a) that it was there on 11 November when I submitted the deliverable and b) I haven't made any commits
to the file since then, so how it works now is how it worked at the time.

## JavaScript deliverable

Most of the basic features are implemented in JavaScript, with artificial data being generated and returned to simulate
database interactions. Local play is fully supported (and online play is functionally equivalent to it for now).

- *Login authentication*: a valid username and password (nearly anything except the empty string) are required to
  authenticate, and pages redirect to the login screen if a valid authtoken is not found
- *Gameplay*: all game rules, win conditions, and player turn tracking logic are represented using JavaScript classes
  and functions
- *Dynamic HTML/CSS*: nearly all event listeners (onclick, onload, etc.) are implemented with DOM manipulations rather
  than HTML properties, info and alert boxes are dynamically shown and hidden, and the entire board is generated from
  JavaScript
- *Modules*: message style is consistent across pages through a single `message-display` module
- *Simulated server communication*: data is sent through JavaScript Promises to a simulated server, which generates and
  returns accurate (albeit artificial) responses for both database access (ex. when sending a game request) and
  WebSocket communication (ex. during gameplay)
- *Persistent data*: usernames, game states, authtokens, and other data is stored in the browser's localStorage

## Web Services deliverable

Account registration and login has been fully implemented (albeit not yet cryptographically securely) using login and
register service endpoints. (Login information is persistent across browser sessions but not server restart.)

Note: I did not have enough time to fully implement the request/create/join game system, so those endpoints are still a
work in progress.
Note: I did not have enough time to fully implement the request/create/join game system, so those endpoints are still a
work in progress.

- *HTTP service with Node.js and `express`*: All connections to the server pass through `express` endpoints.
- *Frontend calls backend service endpoints*: Login and account registration use fully functional endpoints.
- *Static middleware for frontend*: All public HTML and .js files are served using `express`.
- *Calls to third party endpoints*: The "you lost" page shows a suitable inspirational quote.

## CSS deliverable

I added CSS styling using Bootstrap on every page to create a simple but nice design that I'm happy with (although I'm
sure I'll keep fiddling with details through the whole project).

- *Header and footer*: every page has a standardized header and footer with navigation links.
- *Main content body*: context is organized using flexbox into nice-looking elements.
- *Navigation elements*: each page has a home link and logout button in the header, with page-specific navigation
  buttons built into the main page content but with a consistent style.
- *Responsive design*: everything is built using flexbox and responsive design, so it works well on nearly any device.
- *Application elements*: main page content uses Bootstrap styling.
- *Application text content*: I simplified and streamlined text, using styling to create a consistent feel.
- *Application images*: I changed the hardcoded board images into flexbox-styled elements, so they automatically space
  themselves according to the device.

## HTML deliverable

I outlined every page using hardcoded HTML as a structural skeleton of the eventual functionality I want to add.

- *HTML pages*: Each page is structured using placeholder HTML.
- *Links*: Every page has links to the pages relevant to it (including placeholder links for redirects or gamestates),
  including home links in the header.
- *Text*: There's a brief description or welcome on each page.
- *Images*: Placeholder images are used as hardcoded icons on the game board.
- *Login*: Username and password input form with placeholder buttons and links.
- *Database*: Placeholder statistics page including account information and game stats.
- *WebSocket*: Placeholder board page for live play with other users.

## Description Deliverable

### Elevator Pitch

Are you tired of losing games just because of luck? Do you want a fun game that you can work at until you always win?
NIM Player presents a game complex enough to be a challenge, but simple enough that anyone can become a master with
practice. Play live against your friends until you can win every time! Finally, once you've mastered the game, you'll
unlock _The Ultimate Algorithm_--which can mathematically guarantee your victory against your friends (or enemies)!

![Gameboard](img/gameboard.png)

### Key Features

- User authentication through HTTPS
- How-to-Play tutorial
- Personal stats saved and shown to the user
- Live play with other users
- Leaderboard of NiMasters
- 100% (un)original algorithm guaranteed by the Laws of Mathematics to be a winning strategy* _(
  AssumingConsistencyOfZermeloFrankelSetTheoryWithChoice. RestrictionsMayApply.
  AskYourDoctorIfTheLawsOfMathematicsAreRightForYou.)_

#### To add if I have time

- Global statistics
- Multiple game-modes
- Singleplayer against the computer

![Statistics page](img/stats.png)

### Technology

- HTML and CSS: Login screen, game board, stats page, tutorial, suitable chastisement for suboptimal play
- JavaScript: gameplay, board functionality
- Web service: Remote calls for authentication, retrieving statistics
- Authentication: creating accounts and logging in
- Database persistence: account information, game statistics, leaderboard of top players
- WebSocket: live play with other users
- Web framework: ported to the React framework

![Signup page](img/signup.png)
