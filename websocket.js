const WebSocket = require('ws');
const { startGame } = require('./randombattle.js')
const Sim = require("pokemon-showdown");
const {Game} = require("./randombattle");

let waitingPlayer = null;

let games = [];


const wss = new WebSocket.Server({ port: 8080 });



let gameid=0
wss.on('connection', async function connection(ws) {
    console.log('Client connected');

    if (!waitingPlayer) {
        // If there's no waiting player, assign the current player as waiting
        waitingPlayer = ws;
    } else {
        // If there's a waiting player, pair them up and start a new game
        const player1 = waitingPlayer;
        const player2 = ws;
        waitingPlayer = null; // Reset waiting player
        games.push(new Game(player1, player2, gameid));


        gameid++;
    }

    // Event listener for each player's messages
    ws.on('message', async function incoming(message) {
        const jsonObject = JSON.parse(message.toString());
        if (ws===games[jsonObject['game_id']].player1){
            move = `>p1 `
        } else if (ws===games[jsonObject['game_id']].player2) {
            move = `>p2 `
        }
        move = move + jsonObject['move']
        games[jsonObject['game_id']].writeMove(move);
        games[jsonObject['game_id']].handleBtwnTurn();
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});