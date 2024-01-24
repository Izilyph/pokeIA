const Sim = require('pokemon-showdown');
const {Dex} = require('pokemon-showdown');
stream = new Sim.BattleStream();


(async () => {
    for await (const output of stream) {
        //console.log(output);
        if(output.includes("|request|")){
            const requestString = output.slice(output.indexOf("|request|") + "|request|".length);
            teamState = JSON.parse(requestString);
            if(teamState.side.id == 'p1'){
                //console.log(teamState.side.pokemon[0]);
            }
        }
        if(output.includes("|t:|")){
            const updateString = output.slice(output.indexOf("update") + "update".length).split('\n');
            for (const line of updateString){
                if(line.startsWith('|move|p1a')){
                    console.log("Move P1: "+line.slice('|move|p1a:'.length))
                }else if(line.startsWith('|move|p2a')){
                    console.log("Move P2 :" + line.slice('|move|p2a:'.length))
                }else if(line.startsWith('|-damage|p1a')){
                    console.log("Dmg P1 :" + line)
                }else if(line.startsWith('|-damage|p2a')){
                    console.log("Dmg P2 :" + line)
                }else if(line.startsWith('|switch|p1a')){
                    console.log("Switch P1 :" + line)
                }else if(line.startsWith('|switch|p2a')){
                    console.log("Switch P2 :" + line)
                }else if(line.startsWith('|-boost|p1a')){
                    console.log("Boost P1 :" + line)
                }else if(line.startsWith('|-boost|p2a')){
                    console.log("Boost P2 :" + line)
                }else if(line.startsWith('|-unboost|p1a')){
                    console.log("Unboost P1 :" + line)
                }else if(line.startsWith('|-unboost|p2a')){
                    console.log("unboost P2 :" + line)
                }else if(line.startsWith('|-heal|p1a')){
                    console.log("Heal P1:" + line)
                }else if(line.startsWith('|-heal|p2a')){
                    console.log("Heal P2:" + line)
                }else if(line.startsWith('|-status|p1a')){
                    console.log("Status P1:" + line)
                }else if(line.startsWith('|-status|p2a')){
                    console.log("Status P2:" + line)
                }else if(line.startsWith('|-ability|p1a')){
                    console.log("Ability P1:" + line)
                }else if(line.startsWith('|-ability|p2a')){
                    console.log("Ability P2:" + line)
                }else if(line.startsWith('|-end|p1a')){
                    console.log("End P1:" + line)
                }else if(line.startsWith('|-end|p2a')){
                    console.log("End P2:" + line)
                }else if(line.startsWith('|-enditem|p1a')){
                    console.log("Enditem P1:" + line)
                }else if(line.startsWith('|-enditem|p2a')){
                    console.log("Enditem P2:" + line)
                }else if(line.startsWith('|-fail|p1a')){
                    console.log("Fail P1:" + line)
                }else if(line.startsWith('|-fail|p2a')){
                    console.log("Fail P2:" + line)
                }

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



/*console.log(Dex.moves.get('Tackle'));
console.log(Dex.species.get('Tyranitar'));
console.log(Dex.abilities.get('Unnerve'));
console.log(Dex.items.get('Leftovers'));*/