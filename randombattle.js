const Sim = require('pokemon-showdown');
stream = new Sim.BattleStream();


(async () => {
    for await (const output of stream) {
        //console.log(output);
        if(output.includes("|request|")){
            const requestString = output.slice(output.indexOf("|request|") + "|request|".length);
            teamState = JSON.parse(requestString);
            if(teamState.side.id == 'p1'){
                console.log(teamState.side.pokemon[0]);
            }
        }
        if(output.includes("|t:|")){
            const updateString = output.slice(output.indexOf("update") + "update".length);
            if(output.includes("|turn|")){
                const turnNumber = output.slice(output.indexOf("|turn|") + "|turn|".length);
                console.log("Turn :"+ turnNumber);

            }
        }


    }
})();

stream.write(`>start {"formatid":"gen9randombattle"}`);
stream.write(`>player p1 {"name":"Alice"}`);
stream.write(`>player p2 {"name":"Bob"}`);

stream.write(`>p1 move 1`)
stream.write(`>p2 move 2`)

stream.write(`>p1 switch 6`)
stream.write(`>p2 move 3`)
