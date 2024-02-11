const WebSocket = require('ws');
const { startGame } = require('./randombattle.js')

let waitingPlayer = null;

let games = [];


const wss = new WebSocket.Server({ port: 8080 });



let gameid=0
wss.on('connection', function connection(ws) {
    console.log('Client connected');

    if (!waitingPlayer) {
        // If there's no waiting player, assign the current player as waiting
        waitingPlayer = ws;
    } else {
        // If there's a waiting player, pair them up and start a new game
        const player1 = waitingPlayer;
        const player2 = ws;
        waitingPlayer = null; // Reset waiting player

        // Start a new game with the paired players
        startGame(player1, player2, gameid, gameid * 2, gameid * 2 + 1);
        gameid++;
    }

    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});