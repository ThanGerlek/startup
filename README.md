# NIM Player

## Description Deliverable

### Elevator Pitch

Are you tired of losing games just because of luck? Do you want a fun game that you can work at until you always win? NIM Player presents a game complex enough to be a challenge, but simple enough that anyone can become a master with practice. Play with your friends until you can win every time, then try your skills against the computer! Finally, once you've mastered the game, you'll unlock the Ultimate Algorithm--which can mathematically guarantee your victory against your friends (or enemies) in not only Nim Player but infinitely many variations of Nim as well!

### Key Features

- User authentication through HTTPS
- How-to-Play tutorial
- Personal stats saved and shown to the user
- Live play with other users
- Singleplayer against the computer
- Leaderboard of NiMasters
- 100% (un)original algorithm guaranteed by the Laws of Mathematics to be a winning strategy* _(AssumingConsistencyOfZermeloFrankelSetTheoryWithChoice. RestrictionsMayApply. AskYourDoctorIfTheLawsOfMathematicsAreRightForYou.)_

#### To add if I have time

- Global statistics
- Multiple gamemodes

### Technology

- HTML and CSS: Login screen, gameboard, stats page, tutorial, suitable chastisement for suboptimal play
- JavaScript: gameplay, computer's AI
- Web service: Remote calls for authentication, retrieving statistics
- Authentication: creating accounts and logging in
- Database persistence: account information, game statistics, leaderboard of top players
- WebSocket: live play with other users
- Web framework: ported to the React framework
