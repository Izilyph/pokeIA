const WebSocket = require('ws');
const {Game} = require("./randombattle");



let games = {};


const wss = new WebSocket.Server({ port: 8080 });



let gameid=0
wss.on('connection', async function connection(ws) {

    let idgame;
    games[gameid] = new Game(ws, gameid);
    idgame = gameid

    gameid++;

    // Event listener for each player's messages
    ws.on('message', async function incoming(message) {
        const jsonObject = JSON.parse(message.toString());

        jsonObject["moves"].forEach (mv=>{
            console.log(mv)
            games[jsonObject["game_id"]].writeMove(mv)
        })
        games[jsonObject['game_id']].handleBtwnTurn();
    });

    ws.on('close', function close() {
        if (games.hasOwnProperty(idgame)) {
            delete games[idgame];
        }
    });
});
