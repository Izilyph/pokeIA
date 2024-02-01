const Sim = require('pokemon-showdown');
const {Dex} = require('pokemon-showdown');
const pokemon = require('pokemon-showdown/dist/sim/pokemon');

const actions = {
    move: "move",
    damage: "-damage",
    switch: "switch",
    boost: "-boost",
    unboost: "-unboost",
    heal: "-heal",
    status: "-status",
    ability: "-ability",
    end: "-end",
    enditem: "-enditem",
    fail: "-fail"
};

let gameStateP1 = {
    "yourTeam":{
        "active":[],
        "pokemons":[]
    },
    "ennemyTeam":{
        "active":[],
        "pokemons":[]
    },
    "terrain":{},
    "damageCalc":{},
};
let gameStateP2 = {
    "yourTeam":{
        "active":[],
        "pokemons":[]
    },
    "ennemyTeam":{
        "active":[],
        "pokemons":[]
    },
    "terrain":{},
    "damageCalc":{},
};

stream = new Sim.BattleStream();

(async () => {
    for await (const output of stream) {
        //console.log(output);
        if(output.includes("|request|")){
            const requestString = output.slice(output.indexOf("|request|") + "|request|".length);
            teamState = JSON.parse(requestString);
            if(teamState.side.id == 'p1'){
                parsePokemons(gameStateP1,gameStateP2,teamState);
                //console.log(gameStateP2.ennemyTeam.pokemons);
                //console.log(gameStateP1.yourTeam.pokemons[Object.keys(gameStateP1.yourTeam.pokemons)[0]].ability)
            }else{
                parsePokemons(gameStateP2,gameStateP1,teamState);
            }
            gameStateP1.damageCalc = {

            };

            gameStateP2.damageCalc = {

            };
        }
        if(output.includes("|t:|")){
            const updateString = output.slice(output.indexOf("update") + "update".length).split('\n');
            for (let line of updateString) {
                for (const action in actions) {
                    const prefix = `|${actions[action]}|`;
                        if (line.startsWith(prefix)) {
                            const regex = /[:,|]/;
                            line = line.slice(line.startsWith('|-') ? 2 : 1);
                            const act = line.split(regex).map(str => str.slice(str.startsWith(' ') ? 1 : 0));
                            //console.log(act);
                            break;
                        }
                    }
                }
            }
            
        
        if(output.includes("|error|")){
            const errorString = output.slice(output.indexOf("|error|"));
            //console.log(errorString);
        }
    }
})();

function parsePokemons(gameState1,gameState2,team){
    team.side.pokemon.forEach(pokemon => {
        const details = pokemon.details.split(',');
        gameState1.yourTeam.pokemons[details[0]] ={
            "lv":details[1].slice(2),
            "stats":pokemon.stats,
            "condition":pokemon.condition,
            "moves":pokemon.moves.map(move => {
                move = Dex.moves.get(move);
                return {
                    "name":move.name,
                    "accuracy":move.accuracy,
                    "basePower":move.basePower,
                    "category":move.category,
                    "pp":move.pp,
                    "priority":move.priority,
                    "type": move.type,
                    "status":move.status,
                    "secondary":move.secondary
                };
            }),
            "ability":Dex.abilities.get(pokemon.ability),
            "item":pokemon.item
        };
        if(pokemon.active){
            gameState1.yourTeam.active = pokemon;
            if(!gameState2.ennemyTeam.pokemons.hasOwnProperty(details[0])){
                pokeDetails = Dex.species.get(details[0]);
                gameStateP2.ennemyTeam.pokemons[details[0]] = {
                    "types":pokeDetails.types,
                    "abilities":pokeDetails.abilities,
                    "estimatedStats":pokeDetails.baseStats
                }
            }
            
        }
        
    });
}

stream.write(`>start {"formatid":"gen9randombattle"}`);
stream.write(`>player p1 {"name":"Alice"}`);
stream.write(`>player p2 {"name":"Bob"}`);

stream.write(`>p1 move 1`)
stream.write(`>p2 move 2`)

stream.write(`>p1 switch 6`)
stream.write(`>p2 move 3`)


//console.log(Dex.moves.get('Rain Dance'));
/*
console.log(Dex.species.get('Tyranitar'));
console.log(Dex.abilities.get('Unnerve'));
console.log(Dex.items.get('Leftovers'));*/