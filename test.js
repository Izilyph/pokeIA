const Sim = require('pokemon-showdown');
stream = new Sim.BattleStream();

(async () => {
    for await (const output of stream) {
        console.log(output);
    }
})();

stream.write(`>start {"formatid":"gen9randombattle"}`);
stream.write(`>player p1 {"name":"Alice"}`);
stream.write(`>player p2 {"name":"Bob"}`);

stream.write(`>p1 move 1`)
stream.write(`>p2 move 2`)