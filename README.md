# Chessboard App

This is an implementation of a Chess engine from scratch in React.js. It enforces basic chess rules (regular piece movement rules, castling, enpassant, pinned pieces, pawn promotion, stalemate(50 moves without a capture rule, no remaining legal moves for a player not in check.))

You can play a game against yourselff in the single player mode.

The multiplayer mode lets you play against another person with a video feature embedded that allows players to see each other and talk over the course of the game.

At core, the board logic relies on Williams Nimi's coordinate representation of squares using the cartesian coordinate system originally implemented [here](https://github.com/WilliamsNimi/Chess_Logic)

## Live link

Create and play a game [here](https://chess-react-lake.vercel.app/)

## Local setup

### Websocket server
Video streaming and bidirectional moves communication is powered by a simple [websocket server](). You'll have to clone the repo and start the server locally before running the React app UI
- Clone the server repo (run `git clone git@github.com:Ay-slim/chess_websocket.git`)
- cd into the cloned directory and run `yarn && yarn dev` to install packages and start the server

### The UI
- In a separate terminal, clone this repo (run `git clone git@github.com:Ay-slim/chess_react.git`)
- cd into the repo's directory and create a .env file at the root with the following values
  - REACT_APP_WEBSOCKET_URL=http://localhost:1337/
  - REACT_APP_BASE_URL=http://localhost:3000/
  The websocket server defaults to running on port 1337 and the react app will by default open on port 3000 (except you have something already listening on that port in which case you'll have to replace the port in the url above with the port on which your react app is running)
- Run `npm i && npm start` to install packages and start the app locally in your browser
- Go break stuff!
