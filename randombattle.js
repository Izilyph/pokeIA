const Sim = require('pokemon-showdown');
const {Dex} = require('pokemon-showdown');
const fs = require('fs');


const typeChart = {
    "Normal": {
        "weaknesses": ["Fighting"],
        "resistances": [],
        "immunities": ["Ghost"]
    },
    "Fire": {
        "weaknesses": ["Water", "Rock", "Ground"],
        "resistances": ["Grass", "Ice", "Bug", "Steel","Fire","Fairy"],
        "immunities": []
    },
    "Water": {
        "weaknesses": ["Electric", "Grass"],
        "resistances": ["Fire", "Water", "Ice","Steel"],
        "immunities": []
    },
    "Electric": {
        "weaknesses": ["Ground"],
        "resistances": ["Electric", "Flying","Steel"],
        "immunities": []
    },
    "Grass": {
        "weaknesses": ["Fire", "Ice", "Poison", "Flying", "Bug"],
        "resistances": ["Water", "Ground", "Electric","Grass"],
        "immunities": []
    },
    "Ice": {
        "weaknesses": ["Fire", "Fighting", "Rock", "Steel"],
        "resistances": ["Ice"],
        "immunities": []
    },
    "Fighting": {
        "weaknesses": ["Flying", "Psychic", "Fairy"],
        "resistances": ["Bug", "Rock", "Dark"],
        "immunities": []
    },
    "Poison": {
        "weaknesses": ["Ground", "Psychic"],
        "resistances": ["Grass", "Fairy","Fighting","Poison","Bug"],
        "immunities": []
    },
    "Ground": {
        "weaknesses": ["Water", "Grass", "Ice"],
        "resistances": ["Poison", "Rock"],
        "immunities": ["Electric"]
    },
    "Flying": {
        "weaknesses": ["Electric", "Ice", "Rock"],
        "resistances": ["Grass", "Fighting", "Bug"],
        "immunities": ["Ground"]
    },
    "Psychic": {
        "weaknesses": ["Bug", "Ghost", "Dark"],
        "resistances": ["Fighting", "Psychic"],
        "immunities": []
    },
    "Bug": {
        "weaknesses": ["Fire", "Flying", "Rock"],
        "resistances": ["Grass", "Fighting", "Ground"],
        "immunities": []
    },
    "Rock": {
        "weaknesses": ["Water", "Grass", "Fighting", "Ground", "Steel"],
        "resistances": ["Fire", "Poison", "Flying","Normal"],
        "immunities": []
    },
    "Ghost": {
        "weaknesses": ["Ghost", "Dark"],
        "resistances": ["Poison", "Bug"],
        "immunities": ["Normal","Fighting"]
    },
    "Dragon": {
        "weaknesses": ["Ice", "Dragon", "Fairy"],
        "resistances": ["Fire","Water","Grass","Electric"],
        "immunities": []
    },
    "Dark": {
        "weaknesses": ["Fighting", "Bug", "Fairy"],
        "resistances": ["Ghost", "Dark"],
        "immunities": ["Psychic"]
    },
    "Steel": {
        "weaknesses": ["Fire", "Fighting", "Ground"],
        "resistances": ["Normal", "Fairy","Grass","Ice","Flying","Psychic","Bug","Rock","Dragon","Steel"],
        "immunities": ["Poison"]
    },
    "Fairy": {
        "weaknesses": ["Poison", "Steel"],
        "resistances": ["Fighting","Bug", "Dark"],
        "immunities": ["Dragon"]
    }
};

const actions = {
    move: "move",
    damage: "-damage",
    switch: "switch",
    drag:"drag",
    detailschange:"detailschange",
    formechange:"-formechange",
    replace:"replace",
    swap:"swap",
    cant:"cant",
    faint:"faint",
    boost: "-boost",
    unboost: "-unboost",
    setboost:"-setboost",
    swapboost:"-swapboost",
    invertboost:"-invertboost",
    clearboost:"-clearboost",
    clearallboost:"-clearallboost",
    clearpositiveboost:"-clearpositiveboost",
    clearnegativeboost:"-clearnegativeboost",
    copyboost:"-copyboost",
    heal: "-heal",
    status: "-status",
    ability: "-ability",
    endability:"-endability",
    item:"-item",
    enditem: "-enditem",
    fail: "-fail",
    block:"-block",
    notarget:"-notarget",
    miss:"miss",
    sethp:"-sethp",
    curestatus:"-curestatus",
    cureteam:"-cureteam",
    weather:"-weather",
    fieldstart:"-fieldstart",
    fieldend:"-fieldend",
    sidestart:"-sidestart",
    sideend:"-sideend",
    swapsideconditions:"-swapsideconditions",
    start:"-start",
    end:"-end",
    supereffective:"-supereffective",
    resisted:"-resisted",
    immune:"-immune",
    transform:"-transform",
    mega:"-mega",
    primal:"-primal",
    burst:"-burst",
    zpower:"-zpower",
    zbroken:"-zbroken",
    activate:"-activate",
    prepare:"-prepare",
    mustrecharge:"-mustrecharge",
    hitcount:"-hitcount",
    singlemove:"-singlemove",
    singleturn:"-singleturn"
};

let gameStateP1 = {
    "yourTeam":{
        "active":{},
        "pokemons":{},
        "lastMove":{}
    },
    "ennemyTeam":{
        "active":{},
        "pokemons":{},
        "lastMove":{}
    },
    "weather":"None",
    "ground":{
        "hazards":{},
        "field":{}
    },
    "damageCalc":{
        "pokemon":{},
        "target":{},
        "minInv":[],
        "maxInv":[]
    },
};
let gameStateP2 = {
    "yourTeam":{
        "active":{},
        "pokemons":{},
        "lastMove":{}
    },
    "ennemyTeam":{
        "active":{},
        "pokemons":{},
        "lastMove":{}
    },
    "weather":"None",
    "ground":{
        "hazards":{},
        "field":{}
    },
    "damageCalc":{
        "minInv":[],
        "maxInv":[]
    },
};

stream = new Sim.BattleStream();

(async () => {
    for await (const output of stream) {
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
        }
        getPossibleDamage(gameStateP1);
        getPossibleDamage(gameStateP2);
        if(output.includes("|t:|")){
            const updates = output.slice(output.indexOf("update") + "update".length).split('\n');
            console.log(updates)

            findAbilityAndPokemon(updates);
            for (let line of updates) {
                gameStateP1.weather = (line.startsWith("|-weather|") ? updates.slice(updates.indexOf("|-weather|")+ "|-weather|".length): "None");
                if(line.startsWith("|-sidestart|")){
                    const infos = line.split("|");
                    const side = infos[1];
                    const condition = infos[2];
                    if(side.includes("p1")){
                        gameStateP1.ground.hazards[condition] = true;
                    }else{
                        gameStateP2.ground.hazards[condition] = true;
                    }
                }
                if(line.startsWith("|-sideend|")){
                    const infos = line.split("|");
                    const side = infos[1];
                    const condition = infos[2];
                    if(side.includes("p1")){
                        gameStateP1.ground.hazards[condition] = false;

                    }else{
                        gameStateP2.ground.hazards[condition] = false;
                    }
                }
                if(line.startsWith("|-fieldstart|")){
                    const condition = line.split("|")[1];
                    gameStateP1.ground.field[condition] = true;
                    gameStateP2.ground.field[condition] = true;
                }
                if(line.startsWith("|-fieldend|")){
                    const condition = line.split("|")[1];
                    gameStateP1.ground.field[condition] = false;
                    gameStateP2.ground.field[condition] = false;
                }
                if(line.startsWith("|move|")){
                    const move = line.slice(1).split(/[|:]/);
                    if(move[1]=="p1a"){
                        updateMoves(gameStateP2,gameStateP1,move);
                    }else if(move[1]=="p2a"){
                        updateMoves(gameStateP1,gameStateP2,move);
                    }
                }
                if(line.startsWith("|-anim|")){
                    const anim = line.slice(1).split(/[|:]/);
                    if(anim[1]=="p1a"){
                        updateLastMove(gameStateP2,gameStateP1,anim);
                    }else if(anim[1]=="p2a"){
                        updateLastMove(gameStateP1,gameStateP2,anim);
                    }
                }
                if(line.startsWith("|-damage") || line.startsWith("|-heal|")){
                    if(line.includes('/100')){
                        const damage = line.slice(1).split(/[|:]/);
                        if(damage[1]=="p1a"){
                            updateHP(gameStateP2,damage);
                            if(damage.length == 4){
                                estimateOffense(gameStateP1,damage,gameStateP1.ennemyTeam.lastMove);
                                estimateDefense(gameStateP2,damage,gameStateP2.yourTeam.lastMove);
                            }
                        }else if(damage[1]=="p2a"){
                            updateHP(gameStateP1,damage);
                            if(damage.length == 4){
                                estimateOffense(gameStateP2,damage,gameStateP2.ennemyTeam.lastMove);
                                estimateDefense(gameStateP1,damage,gameStateP1.yourTeam.lastMove);
                            }
                        }
                    }
                }
                if(line.includes("[from] item")){
                    const revealedItem = line.slice(1).split(/[|:]/);
                    if(revealedItem[1]=="p1a"){
                        updateRevealedItem(gameStateP2,revealedItem);
                    }else if(revealedItem[1]=="p2a"){
                        updateRevealedItem(gameStateP1,revealedItem);
                    }
                }
                if(line.startsWith("|-item|")){
                    const item = line.slice(1).split(/[|:]/);
                    if(item[1]=="p1a"){
                        updateItem(gameStateP2,item,false);
                    }else if(item[1]=="p2a"){
                        updateItem(gameStateP1,item,false);
                    }
                }
                if(line.startsWith("|-enditem|")){
                    const item = line.slice(1).split(/[|:]/);
                    if(item[1]=="p1a"){
                        updateItem(gameStateP2,item,true);
                    }else if(item[1]=="p2a"){
                        updateItem(gameStateP1,item,true);
                    }
                }
                if(line.startsWith("|-boost|") || line.startsWith("|-setboost|")){
                    const boost = line.slice(1).split(/[|:]/);
                    if(boost[1]=="p1a"){
                        updateStats(gameStateP2,boost,true);
                    }else if(boost[1]=="p2a"){
                        updateStats(gameStateP1,boost,true);
                    }
                }
                if(line.startsWith("|-unboost|")){
                    const unboost = line.slice(1).split(/[|:]/);
                    if(unboost[1]=="p1a"){
                        updateStats(gameStateP2,unboost,false);
                    }else if(unboost[1]=="p2a"){
                        updateStats(gameStateP1,unboost,false);
                    }
                }
                if(line.startsWith("|-swapboost|")){
                    const swapboost = line.slice(1).split(/[|:]/);
                    if(swapboost[1]=="p1a"){
                        swapBoost(gameStateP2,gameStateP1,swapboost);
                    }else if(swapboost[1]=="p2a"){
                        swapBoost(gameStateP1,gameStateP2,swapboost);
                    }
                }
                if(line.startsWith("|-invertboost|")){
                    const invertboost = line.slice(1).split(/[|:]/);
                    if(invertboost[1]=="p1a"){
                        invertBoost(gameStateP2,invertboost);
                    }else if(invertboost[1]=="p2a"){
                        invertBoost(gameStateP1,invertboost);
                    }
                }
                if(line.startsWith("|-clearboost|")){
                    const clearboost = line.slice(1).split(/[|:]/);
                    if(clearboost[1]=="p1a"){
                        clearBoost(gameStateP2,clearboost);
                    }else if(clearboost[1]=="p2a"){
                        clearBoost(gameStateP1,clearboost);
                    }
                }
                if(line.startsWith("|-clearallboost|")){
                    clearAllBoost(gameStateP1,gameStateP2);
                }
                if(line.startsWith("|-clearpositiveboost|")){
                    const clearpositiveboost = line.slice(1).split(/[|:]/);
                    if(clearpositiveboost[1]=="p1a"){
                        clearPositiveBoost(gameStateP2,clearpositiveboost);
                    }else if(clearpositiveboost[1]=="p2a"){
                        clearPositiveBoost(gameStateP1,clearpositiveboost);
                    }
                }
                if(line.startsWith("|-clearnegativeboost|")){
                    const clearnegativeboost = line.slice(1).split(/[|:]/);
                    if(clearnegativeboost[1]=="p1a"){
                        clearNegativeBoost(gameStateP2,clearnegativeboost);
                    }else if(clearnegativeboost[1]=="p2a"){
                        clearNegativeBoost(gameStateP1,clearnegativeboost);
                    }
                }
                if(line.startsWith("|-copyboost|")){
                    const copyboost = line.slice(1).split(/[|:]/);
                    if(copyboost[1]=="p1a"){
                        copyBoost(gameStateP2,gameStateP1,copyboost);
                    }else if(copyboost[1]=="p2a"){
                        copyBoost(gameStateP1,gameStateP2,copyboost);
                    }
                }
                if(line.startsWith("|-status|")){
                    const status = line.slice(1).split(/[|:]/);
                    if(status[1]=="p1a"){
                        updateStatus(gameStateP2,status,false);
                    }else if(status[1]=="p2a"){
                        updateStatus(gameStateP1,status,false);
                    }
                }
                if(line.startsWith("|-curestatus|")){
                    const status = line.slice(1).split(/[|:]/);
                    if(status[1]=="p1a"){
                        updateStatus(gameStateP2,status,true);
                    }else if(status[1]=="p2a"){
                        updateStatus(gameStateP1,status,true);
                    }
                }
                if(line.startsWith("|-cureteam|")){
                    const cure = line.slice(1).split(/[|:]/);
                    if(cure[1]=="p1a"){
                        cureAllStatus(gameStateP2);
                    }else if(cure[1]=="p2a"){
                        cureAllStatus(gameStateP1);
                    }
                }
                if(line.startsWith("|-start|")){
                    const volatileStatus= line.slice(1).split(/[|:]/);
                    if(volatileStatus[1]=="p1a"){
                        updateVolatileStatus(gameStateP2,gameStateP1,volatileStatus,false);
                    }else if(volatileStatus[1]=="p2a"){
                        updateVolatileStatus(gameStateP1,gameStateP2,volatileStatus,false);
                    }
                }
                if(line.startsWith("|-end|")){
                    const volatileStatus= line.slice(1).split(/[|:]/);
                    if(volatileStatus[1]=="p1a"){
                        updateVolatileStatus(gameStateP2,gameStateP1,volatileStatus,true);
                    }else if(volatileStatus[1]=="p2a"){
                        updateVolatileStatus(gameStateP1,gameStateP2,volatileStatus,true);

                    }
                }
                if(line.startsWith("|replace|")){
                    const replace = line.slice(1).split(/[|:]/);
                    if(replace.includes("Zoroark")){
                        if(replace[1] == "p1a"){
                            endIllusion(gameStateP2,replace);
                        }else if(replace[1] == "p2a"){
                            endIllusion(gameStateP1,replace);
                        }
                    }
                }
                if(line.startsWith("|-transform")){
                    const transform = line.slice(1).split(/[|:]/);
                    if(transform[1]==="p1a"){
                        activateTransform(gameStateP1,gameStateP2);
                    }else if(transform[2]==="p1a"){
                        activateTransform(gameStateP2,gameStateP1);
                    }
                }
                if(line.startsWith("|drag|") && line.includes("/100")){
                    const drag = line.slice(1).split(/[|:]/);
                    if(drag[1]==="p1a"){
                        dragPokemon(gameStateP2,gameStateP1,drag);
                    }else if(drag[1]==="p2a"){
                        dragPokemon(gameStateP1,gameStateP2,drag);
                    }
                }
                if(line.startsWith("|turn|")){
                    const turn = line.slice(1).split("|");
                    const turnNumber = turn[1];
                    //Send game state
                }
            }
        }

        if(output.includes("|error|")){
            const errorString = output.slice(output.indexOf("|error|"));
            //console.log(errorString);
        }
        //fs.writeFileSync('gameStateP1.json',JSON.stringify(gameStateP1,null,2),'utf-8');
        //fs.writeFileSync('gameStateP2.json',JSON.stringify(gameStateP2,null,2),'utf-8');

    }
})();

function parsePokemons(gameState1,gameState2,team){
    team.side.pokemon.forEach(pokemon => {
        let details = pokemon.details.split(',');
        let dexDetails = Dex.species.get(details[0]);
        gameState1.yourTeam.pokemons[details[0]] = {
            "name":details[0],
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
            "ability":Dex.abilities.get(pokemon.ability).name,
            "item":pokemon.item,
            "types":dexDetails.types,
            "volatileStatus":[]
        };
        if(pokemon.active){
            gameState1.yourTeam.active = gameState1.yourTeam.pokemons[details[0]];
            //If active pokemon is Zoroark or Zoroark-Hisui
            if(pokemon.ability==="illusion"){
                //Replace its info by last alive ennemy pokemon's 
                if(!gameState2.ennemyTeam.pokemons.hasOwnProperty(details[0]) || (gameState2.ennemyTeam.pokemons.hasOwnProperty(details[0]) && gameState2.ennemyTeam.pokemons[details[0]].currentHP==100)){
                    for (let i = team.side.pokemon.length - 1; i >= 0; i--) {
                        const lastPokemon = team.side.pokemon[i];
                    
                        if (!lastPokemon.condition.includes('fnt')) {
                            pokemon = lastPokemon;
                            break;
                        }
                    }
                    details = pokemon.details.split(',');
                    dexDetails = Dex.species.get(details[0]);
                }
                
            }
            
            if(!gameState2.ennemyTeam.pokemons.hasOwnProperty(details[0])){
                gameState2.ennemyTeam.pokemons[details[0]] = {
                    "lv":details[1].slice(2),
                    "types":dexDetails.types,
                    "abilities":dexDetails.abilities,
                    "estimatedStats":{...dexDetails.baseStats},
                    "statsAfterBoost":{...dexDetails.baseStats},
                    "statsModifiers":{
                        "atk":{"boost":0,"unboost":0},
                        "def":{"boost":0,"unboost":0},
                        "spa":{"boost":0,"unboost":0},
                        "spd":{"boost":0,"unboost":0},
                        "spe":{"boost":0,"unboost":0},
                    },
                    "moves":{},
                    "currentHP":100,
                    "item":"unknown",
                    "status":"None",
                    "volatileStatus":[]
                };
            }
            gameState2.ennemyTeam.active = {...gameState2.ennemyTeam.pokemons[details[0]]};
            gameState2.ennemyTeam.active.name = details[0];
        }else{
            if(gameState2.ennemyTeam.pokemons.hasOwnProperty(details[0])){
                gameState2.ennemyTeam.pokemons[details[0]].statsAfterBoost = {...gameState2.ennemyTeam.pokemons[details[0]].estimatedStats};
                gameState2.ennemyTeam.pokemons[details[0]].volatileStatus = [];
            }
            gameState1.yourTeam.pokemons[details[0]].volatileStatus = [];
        }
    });
}

function dragPokemon(gameState1,gameState2,drag){
    const draggedPokemonName = Object.keys(gameState2.yourTeam.pokemons)
        .find(key => key.includes(drag[2].slice(1)));
    const details = drag[3].split(",");
    const dexDetails = Dex.species.get(draggedPokemonName);

    //If active pokemon is Zoroark or Zoroark-Hisui
    if(gameState2.yourTeam.pokemons[draggedPokemonName].ability==="illusion"){
        //Replace its info by last alive ennemy pokemon's 
        if(!gameState1.ennemyTeam.pokemons.hasOwnProperty(draggedPokemonName) || (gameState1.ennemyTeam.pokemons.hasOwnProperty(draggedPokemonName) && gameState1.ennemyTeam.pokemons[draggedPokemonName].currentHP==100)){
            const keys = Object.keys(gameState2.yourTeam.pokemons);
            for (let i = keys.length - 1; i >= 0; i--) {
                const lastPokemon = gameState2.yourTeam.pokemons[keys[i]];
            
                if (!lastPokemon.condition.includes('fnt')) {
                    details = lastPokemon.details.split(',');
                    dexDetails = Dex.species.get(details[0]);
                }
            }
        }
        
    }
    if(!gameState1.ennemyTeam.pokemons.hasOwnProperty(draggedPokemonName)){
        gameState1.ennemyTeam.pokemons[draggedPokemonName] = {
            "lv":details[1].slice(2),
            "types":dexDetails.types,
            "abilities":dexDetails.abilities,
            "estimatedStats":{...dexDetails.baseStats},
            "statsAfterBoost":{...dexDetails.baseStats},
            "statsModifiers":{
                "atk":{"boost":0,"unboost":0},
                "def":{"boost":0,"unboost":0},
                "spa":{"boost":0,"unboost":0},
                "spd":{"boost":0,"unboost":0},
                "spe":{"boost":0,"unboost":0},
            },
            "moves":{},
            "currentHP":100,
            "item":"unknown",
            "status":"None",
            "volatileStatus":[]
        };
    }
    gameState1.ennemyTeam.active = {...gameState2.ennemyTeam.pokemons[draggedPokemonName]};
    gameState1.ennemyTeam.active.name = draggedPokemonName;
}

function updateMoves(gameState1,gameState2,move){
    const moveName = move[3];
    const pokemonName = Object.keys(gameState1.ennemyTeam.pokemons)
        .find(key => key.includes(move[2].slice(1)));
    console.log("Move of:"+pokemonName)
    const enemyPokemon = gameState1.ennemyTeam.pokemons[pokemonName];
    let moveInfo = enemyPokemon.moves[moveName];
    if (moveInfo === undefined) {
        moveInfo ??= { "pp": Dex.moves.get(moveName).pp };
    } else {
        moveInfo.pp -= 1;
    }
    gameState1.ennemyTeam.pokemons[pokemonName].moves[moveName] = moveInfo;
    gameState1.ennemyTeam.lastMove = gameState2.yourTeam.lastMove = {
        "pokemon":pokemonName,
        "target":move[5].slice(1),
        "moveName":moveName
    };
}

function updateLastMove(gameState1,gameState2,move){
    const moveName = move[3];
    const pokemonName = Object.keys(gameState1.ennemyTeam.pokemons)
    .find(key => key.includes(move[2].slice(1)));
    gameState1.ennemyTeam.lastMove = gameState2.yourTeam.lastMove = {
        "pokemon":pokemonName,
        "target":move[5].slice(1),
        "moveName":moveName
    };
}

function updateStatus(gameState,status,hasRecovered){
    const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
        .find(key => key.includes(status[2].slice(1)));
    gameState.ennemyTeam.pokemons[pokemonName].status = (hasRecovered ? "None" : status[3]);
}

function cureAllStatus(gameState){
    for(let pokemon in gameState.ennemyTeam.pokemons){
        pokemon.status = "None";
    }
}

function updateVolatileStatus(gameState1,gameState2,volatileStatus,hasEnded){
    const pokemonName = Object.keys(gameState1.ennemyTeam.pokemons)
        .find(key => key.includes(volatileStatus[2].slice(1)));
    console.log("Status: "+pokemonName);
    console.log(gameState1.ennemyTeam.pokemons)
    if(hasEnded){
        const endType = volatileStatus[3];
        if(endType=="Quark Drive" || endType=="Protosynthesis"){
            gameState1.ennemyTeam.pokemons[pokemonName].abilities = {'0':"None"};
        }else{
            gameState1.ennemyTeam.pokemons[pokemonName].volatileStatus.filter(status => status != endType);
            gameState2.yourTeam.pokemons[pokemonName].volatileStatus.filter(status => status != endType);
        }
    }else{
        gameState1.ennemyTeam.pokemons[pokemonName].volatileStatus.push(volatileStatus[4]);
        gameState2.yourTeam.pokemons[pokemonName].volatileStatus.push(volatileStatus[4]);

    }
}

function updateStats(gameState,boost,isBoost){
    const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
    .find(key => key.includes(boost[2].slice(1)));
    const stat = boost[3];
    if(stat!="accuracy" && stat!="evasion"){
        const boostValue = parseInt(boost[4]);
        const pokemonStat = gameState.ennemyTeam.pokemons[pokemonName].statsAfterBoost[stat];
        let res = 0;
        if(isBoost){
            gameState.ennemyTeam.pokemons[pokemonName].statsModifiers[stat].boost += boostValue;
            res = Math.floor(pokemonStat * (boostValue+2)/2);
        }else{
            gameState.ennemyTeam.pokemons[pokemonName].statsModifiers[stat].unboost += boostValue;
            res = Math.floor(pokemonStat * 2/(boostValue + 2));      
        }
        
        gameState.ennemyTeam.pokemons[pokemonName].statsAfterBoost[stat] = res;
    }   
}

function invertBoost(gameState,invertboost){
    const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
    .find(key => key.includes(invertboost[2].slice(1)));
    const pokemon = gameState.ennemyTeam.pokemons[pokemonName];
    const boosts = {...pokemon.statsModifiers};
    Object.keys(pokemon.statsModifiers).forEach(stat => {
        pokemon.statsModifiers[stat].boost = boosts[stat].unboost;
        pokemon.statsModifiers[stat].unboost = boosts[stat].boost;
        let res = Math.floor(pokemon.estimatedStats[stat] * (pokemon.statsModifiers[stat].boost+2)/2);
        pokemon.statsAfterBoost[stat] = Math.floor(res * 2/(pokemon.statsModifiers[stat].unboost + 2));
    });
}

function swapBoost(gameState1,gameState2,swapboost){
    const pokemonSourceName = Object.keys(gameState1.ennemyTeam.pokemons)
    .find(key => key.includes(swapboost[2].slice(1)));
    const targetName = Object.keys(gameState2.ennemyTeam.pokemons)
    .find(key => key.includes(swapboost[4].slice(1)));
    const pokemonSource = gameState1.ennemyTeam.pokemons[pokemonSourceName];
    const target = gameState2.ennemyTeam.pokemons[targetName];
    const boostsToSwap = swapboost[5];
    for(let boost in boostsToSwap){
        const tmp = pokemonSource.statsModifiers[boost];
        pokemonSource.statsModifiers[boost] = target.statsModifiers[boost];
        target.statsModifiers[boost] = tmp;
    }
    Object.keys(pokemonSource.statsModifiers).forEach(stat => {
        let res = Math.floor(pokemonSource.estimatedStats[stat] * (pokemonSource.statsModifiers[stat].boost+2)/2);
        pokemonSource.statsAfterBoost[stat] = Math.floor(res * 2/(pokemonSource.statsModifiers[stat].unboost + 2));

    });
    Object.keys(target.statsModifiers).forEach(stat => {
        let res = Math.floor(target.estimatedStats[stat] * (target.statsModifiers[stat].boost+2)/2);
        target.statsAfterBoost[stat] = Math.floor(res * 2/(target.statsModifiers[stat].unboost + 2));
    });
}

function clearBoost(gameState,clearboost){
    const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
    .find(key => key.includes(clearboost[2].slice(1)));
    const pokemon = gameState.ennemyTeam.pokemons[pokemonName];
    Object.keys(pokemon.statsModifiers).forEach(stat => {
        pokemon.statsModifiers[stat] = {
            "boost":0,
            "unboost":0
        };
    });
    pokemon.statsAfterBoost = {...pokemon.estimatedStats};
}

function clearAllBoost(gameState1,gameState2){
    const pokemon1 = gameState1.ennemyTeam.pokemons[gameState1.ennemyTeam.active.name];
    const pokemon2 = gameState2.ennemyTeam.pokemons[gameState2.ennemyTeam.active.name];
    Object.keys(pokemon1.statsModifiers).forEach(stat => {
        pokemon1.statsModifiers[stat] = {
            "boost":0,
            "unboost":0
        };
    });
    Object.keys(pokemon2.statsModifiers).forEach(stat => {
        pokemon2.statsModifiers[stat] = {
            "boost":0,
            "unboost":0
        };
    });
    pokemon1.statsAfterBoost = {...pokemon1.estimatedStats};
    pokemon2.statsAfterBoost = {...pokemon2.estimatedStats};
}

function clearPositiveBoost(gameState,clearpositiveboost){
    const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
    .find(key => key.includes(clearpositiveboost[2].slice(1)));
    const pokemon = gameState.ennemyTeam.pokemons[pokemonName];
    Object.keys(pokemon.statsModifiers).forEach(stat => {
        pokemon.statsModifiers[stat].boost = 0;
        pokemon.statsAfterBoost[stat] = Math.floor(pokemon.estimatedStats[stat] * 2/(pokemon.statsModifiers[stat].unboost + 2));
    });
}

function clearNegativeBoost(gameState,clearnegativeboost){
    const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
    .find(key => key.includes(clearnegativeboost[2].slice(1)));
    const pokemon = gameState.ennemyTeam.pokemons[pokemonName];
    Object.keys(pokemon.statsModifiers).forEach(stat => {
        pokemon.statsModifiers[stat].unboost = 0;
        pokemon.statsAfterBoost[stat] = Math.floor(pokemon.estimatedStats[stat] * (pokemon.statsModifiers[stat].boost+2)/2);
    });
}

function copyBoost(gameState1,gameState2,copyboost){
    const pokemonSourceName = Object.keys(gameState1.ennemyTeam.pokemons)
    .find(key => key.includes(copyboost[2].slice(1)));
    const pokemonSource = gameState1.ennemyTeam.pokemons[pokemonSourceName];
    const targetName = Object.keys(gameState2.ennemyTeam.pokemons)
    .find(key => key.includes(copyboost[4].slice(1)));
    const target = gameState2.ennemyTeam.pokemons[targetName];

    target.statsModifiers = {...pokemonSource.statsModifiers};
    Object.keys(target.statsModifiers).forEach(stat => {
        let res = Math.floor(target.estimatedStats[stat] * (target.statsModifiers[stat].boost+2)/2);
        target.statsAfterBoost[stat] = Math.floor(res * 2/(target.statsModifiers[stat].unboost + 2));
    });
}

function estimateOffense(gameState,damage,lastMove){
    if(Object.keys(lastMove).length != 0 && lastMove.moveName!="Belly Drum"){
        const defendingPokemonName = Object.keys(gameState.yourTeam.pokemons)
        .find(key => key.includes(lastMove.target));
        const attackingPokemonName = Object.keys(gameState.ennemyTeam.pokemons)
        .find(key => key.includes(lastMove.pokemon));
        const defendingPokemon = gameState.yourTeam.pokemons[defendingPokemonName];
        const attackingPokemon = gameState.ennemyTeam.pokemons[attackingPokemonName];

        let lostHP = parseInt(damage[3].split('/')[0]);
        const maxHP = parseInt(defendingPokemon.condition.split(/[/:]/)[1])
        lostHP = maxHP - Math.floor(lostHP * maxHP/100);
        const moveInfo = Dex.moves.get(lastMove.moveName);
        const bp = moveInfo.basePower;
        const lv = parseInt(attackingPokemon.lv);
        const def = (moveInfo.category == 'Physical' ? defendingPokemon.stats['def'] : defendingPokemon.stats['spd']);
        const off = (moveInfo.category == 'Physical' ? "atk" : "spa");
        const stab = (attackingPokemon.types.includes(moveInfo.type) ? 1.5 : 1);
        const weather = getWeatherMultiplier(moveInfo.type,gameState.weather);
        const burn = ((moveInfo.category=='Physical' && attackingPokemon.status =="brn" && attackingPokemon.ability!="Guts") ? 0.5 : 1);
        const type = getTypeMultiplier(moveInfo.type,defendingPokemon.types,lastMove.moveName,defendingPokemon.ability,defendingPokemon.volatileStatus,defendingPokemon.item);
        const other = getOtherMultipliers(lastMove.moveName,gameState.ground,type,defendingPokemon.ability,attackingPokemon.abilities,attackingPokemon.item,defendingPokemon.currentHP,defendingPokemon.volatileStatus);

        const estimatedOffense = findOffense(lostHP,lv,def,bp,1,weather,1,1,stab,type,burn,other);
        if(attackingPokemon.statsModifiers!=undefined){
            if(attackingPokemon.statsModifiers[off]!=undefined){
                for(let estimate in estimatedOffense){
                    estimate = Math.floor(2*estimate/(attackingPokemon.statsModifiers[off].boost+2));
                    estimate = Math.floor(estimate*(attackingPokemon.statsModifiers[off].unboost+2)*2);
                }
            }
        }
        
        gameState.ennemyTeam.pokemons[attackingPokemonName].estimatedStats[off] = Math.floor((estimatedOffense.min + estimatedOffense.max)/2);
    }
}

function estimateDefense(gameState,damage,lastMove){
    if(Object.keys(lastMove).length != 0){
        const defendingPokemonName = Object.keys(gameState.ennemyTeam.pokemons)
        .find(key => key.includes(lastMove.target));
        const attackingPokemonName = Object.keys(gameState.yourTeam.pokemons)
        .find(key => key.includes(lastMove.pokemon));
        const defendingPokemon = gameState.ennemyTeam.pokemons[defendingPokemonName];
        const attackingPokemon = gameState.yourTeam.pokemons[attackingPokemonName];
    
        let lostHP = parseInt(damage[3].split('/')[0]);
        const lv = parseInt(attackingPokemon.lv);
        const baseHP = Dex.species.get(defendingPokemonName).baseStats.hp;
        const estimatedMaxHP = getHp(baseHP,31,0,lv);
        const estimatedMaxHPMaxInv = getHp(baseHP,31,252,lv);
        const lostHPMaxInv = estimatedMaxHPMaxInv - Math.floor(lostHP * estimatedMaxHPMaxInv/100);
        lostHP = estimatedMaxHP - Math.floor(lostHP * estimatedMaxHP/100);
        
        
        const moveInfo = Dex.moves.get(lastMove.moveName);
        const bp = moveInfo.basePower;
        const def = (moveInfo.category == 'Physical' ? "def" :"spd");
        const off = (moveInfo.category == 'Physical' ? attackingPokemon.stats['atk'] : attackingPokemon.stats['spa']);
        const stab = (attackingPokemon.types.includes(moveInfo.type) ? 1.5 : 1);
        const weather = getWeatherMultiplier(moveInfo.type,gameState.weather);
        const burn = ((moveInfo.category=='Physical' && attackingPokemon.condition.includes("brn") && attackingPokemon.ability!="Guts") ? 0.5 : 1);
        const type = getTypeMultiplier(moveInfo.type,defendingPokemon.types,lastMove.moveName,defendingPokemon.abilities,defendingPokemon.volatileStatus,defendingPokemon.item);
        const other = getOtherMultipliers(lastMove.moveName,gameState.ground,type,defendingPokemon.abilities,attackingPokemon.ability,attackingPokemon.item,defendingPokemon.currentHP,defendingPokemon.volatileStatus);
        const estimatedDefense = findDefense(lostHP,lv,off,bp,1,weather,1,1,stab,type,burn,other)
        const estimatedDefenseMaxInv = findDefense(lostHPMaxInv,lv,off,bp,1,weather,1,1,stab,type,burn,other);
        const state = (gameState == gameStateP1 ? gameStateP2 : gameStateP1)
        /*console.log(state.yourTeam.pokemons[defendingPokemonName].stats)
        console.log(estimatedDefense)
        console.log(estimatedDefenseMaxInv)
        console.log(Math.floor((estimatedDefense.min+estimatedDefense.max)/2));
        console.log(Math.floor((estimatedDefenseMaxInv.min+estimatedDefenseMaxInv.max)/2))*/
        if(attackingPokemon.statsModifiers!=undefined){
            if(attackingPokemon.statsModifiers[off]!=undefined){
                for(let estimate in estimatedDefense){
                    estimate = Math.floor(2*estimate/(attackingPokemon.statsModifiers[off].boost+2));
                    estimate = Math.floor(estimate*(attackingPokemon.statsModifiers[off].unboost+2)*2);
                }
            }
        }
        
        gameState.ennemyTeam.pokemons[defendingPokemonName].estimatedStats[def] = Math.floor((estimatedDefense.min+estimatedDefense.max)/2);
    } 
}

function updateItem(gameState,item,endItem){
    const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
    .find(key => key.includes(item[2].slice(1)));
    gameState.ennemyTeam.pokemons[pokemonName].item = (endItem ? "None" : item[3]);
}

function updateRevealedItem(gameState,revealedItem){
    const item = revealedItem[revealedItem.length-1].slice(1);
    if(!item.includes('Berry')){
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
        .find(key => key.includes(revealedItem[2].slice(1)));
        const pokemon = gameState.ennemyTeam.pokemons[pokemonName];
        pokemon.item = item;
    }  
}

function updateHP(gameState,damage){
    const hp = damage[3].split('/');
    const currentHp = parseInt(hp[0]);
    console.log(damage[2].slice(1))
    const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
    .find(key => key.includes(damage[2].slice(1)));
    console.log(pokemonName)
    gameState.ennemyTeam.pokemons[pokemonName].currentHP = currentHp;
}

function endIllusion(gameState,replace){
    const illusion = gameState.ennemyTeam.active;
    const newFormDetails = replace[3];
    const dexDetails = Dex.species.get(newFormDetails[0]);
    if(!gameState.ennemyTeam.pokemons.hasOwnProperty(newFormDetails[0])){
        gameState.ennemyTeam.pokemons[newFormDetails[0]] = {
            "lv":newFormDetails[1].slice(2),
            "types":dexDetails.types,
            "abilities":dexDetails.abilities,
            "estimatedStats":{...dexDetails.baseStats},
            "statsAfterBoost":{...dexDetails.baseStats},
            "statsModifiers":{...illusion.statsModifiers},
            "moves":{},
            "currentHP":illusion.currentHP,
            "item":illusion.item,
            "status":illusion.item,
            "volatileStatus":[...illusion.volatileStatus]
        };
    }
    let newForm = gameState.ennemyTeam.pokemons[newFormDetails[0]];
    Object.keys(newForm.statsAfterBoost).forEach(stat => {
        let res = Math.floor(newForm.estimatedStats[stat] * (newForm.statsModifiers[stat].boost+2)/2);
        newForm.statsAfterBoost[stat] = Math.floor(res * 2/(newForm.statsModifiers[stat].unboost + 2));
    });
    delete gameState.ennemyTeam.pokemons[illusion.name];
    gameState.ennemyTeam.active = newForm;
    gameState.ennemyTeam.active.name = newFormDetails[0];
}

function activateTransform(gameState1,gameState2){
    //If active pokemon is Metamorph
    const activeEnnemyPokemon = gameState2.yourTeam.active;
    let metamorph = gameState2.ennemyTeam.pokemons[gameState1.yourTeam.active.name];
    metamorph.types = [...activeEnnemyPokemon.types];
    metamorph.abilities = {'0':activeEnnemyPokemon.ability};
    metamorph.estimatedStats = {...Dex.species.get(activeEnnemyPokemon.name).baseStats};
    metamorph.statsAfterBoost = {...activeEnnemyPokemon.stats};
    metamorph.statsModifiers = {...gameState1.ennemyTeam.pokemons[activeEnnemyPokemon.name]};
    metamorph.moves = {...activeEnnemyPokemon.moves};   
}

function getStat(baseStat,iv,ev,level,nature){
    return (Math.floor(0.01 *(2 * baseStat + iv + Math.floor(0.25 * ev))*level) + 5) * nature
}

function getHp(baseHP,iv,ev,level){
    return Math.floor(0.01 * (2 * baseHP + iv + Math.floor(0.25 * ev)) * level) + level + 10
}

function getDefStatToUse(move,target){
    const defStat = target.statsAfterBoost['def'];
    const spdStat = target.statsAfterBoost['spd'];
    let statToUse = (move.category === 'Physical' ?  defStat : spdStat );
    if(move.name==="Shell Side Arm"){
        statToUse = (defStat >= spdStat ? spdStat : defStat );
    }
    return statToUse
}

function getPossibleDamage(gameState){
    damages = [];
    const pokemon = gameState.yourTeam.active;
    const target = gameState.ennemyTeam.active;
    console.log(target)
    gameState.damageCalc.pokemon = pokemon.name;
    gameState.damageCalc.target = target.name;
    if(Object.keys(target).length!=0 && Object.keys(pokemon).length!=0){
        pokemon.moves.forEach(move => {
            const bp = move.basePower;
            if(bp!=0){
                const dexInfos = Dex.species.get(target.name);
                const lv = parseInt(pokemon.lv);
                const off = (move.category === 'Physical' ? (move.name === 'Body Press' ? pokemon.stats['def'] : pokemon.stats['atk']) : pokemon.stats['spa']);

                const def = getDefStatToUse(move,target);

                const stab = (pokemon.types.includes(move.type) ? 1.5 : 1);
                const weather = getWeatherMultiplier(move.type,gameState.weather);
                const burn = ((move.category==='Physical' && pokemon.condition.includes("brn") && pokemon.ability!="Guts") ? 0.5 : 1);
                const type = getTypeMultiplier(move.type,target.types,move.name,target.abilities,target.volatileStatus,target.item);
                const other = getOtherMultipliers(move,gameState.ground,type,target.abilities,pokemon.ability,pokemon.item,target.currentHP,target.volatileStatus);
                gameState.damageCalc.minInv[move.name] = calculateDamage(lv, off, getStat(def,31,0,parseInt(target.lv),1), bp, 1, weather, 1, 1, stab, type, burn, other)
                .map(dmg => Math.floor(100 * (dmg/getHp(dexInfos.baseStats['hp'],31,0,parseInt(target.lv)))));
                gameState.damageCalc.maxInv[move.name] = calculateDamage(lv, off, getStat(def,31,252,target.lv,1), bp, 1, weather, 1, 1, stab, type, burn, other)
                .map(dmg => Math.floor(100 * (dmg/getHp(dexInfos.baseStats['hp'],31,252,parseInt(target.lv)))));
            }
        });
    }
}

function getOtherMultipliers(move,ground,typeMultiplier,targetAbility,pokemonAbility,item,targetCurrentHP,targetVolatileStatus){
    const moveInfo = Dex.moves.get(move.name);
    const itemName = item.toLowerCase().replace(/\s/g, '');
    let res = 1;
    if(itemName=="lifeorb"){
        res *= 5324/4096;
    }
    if(itemName=="expertbelt" && typeMultiplier > 1){
        res *= 4915/4096;
    }
    if(targetAbility=="Fluffy" && moveInfo.type =="Fire"){
        res *= 2;
    }
    if(pokemonAbility=="Tinted Lens" && typeMultiplier < 1){
        res *= 2;
    }
    if(pokemonAbility=="Neuroforce" && typeMultiplier > 1){
        res *= 1.25;
    }
    if((targetAbility=="Filter" || targetAbility=="Prism Armor" || targetAbility=="Solid Rock") && typeMultiplier > 1){
        res *= 0.75;
    }
    if(targetAbility=="Ice Scales" && moveInfo.category =="Special"){
        res *= 0.5;
    }
    if(targetAbility=="Punk Rock" && moveInfo.flags.hasOwnProperty("sound")){
        res *= 0.5;
    }
    if(targetAbility=="Fluffy" && moveInfo.flags.hasOwnProperty("contact")){
        res *= 0.5;
    }
    if((targetAbility=="Shadow Shield" || targetAbility=="Multiscale") && targetCurrentHP == 100){
        res *= 0.5;
    }
    if((move=="Collision Course" || move=="Electro Drift") && typeMultiplier > 1){
        res *= 5461/4096;
    }
    if(moveInfo.category=="Special" && (ground.hazards["Light Screen"]==true || ground.hazards["Aurora Veil"]==true)){
        res *= 0.5;
    }
    if(moveInfo.category=="Physical" && (ground.hazards["Reflect"]==true || ground.hazards["Aurora Veil"]==true)){
        res *= 0.5;
    }
    if(targetVolatileStatus.includes("Glaive Rush")){
        res *= 2;
    }
    if(targetVolatileStatus.includes("Tar Shot") && moveInfo.type=="Fire"){
        res *= 2;
    }
    if(pokemonAbility=="Transistor" && moveInfo.type=="Electric"){
        res *= 1.3;
    }
    if(pokemonAbility=="Dragon's Maw" && moveInfo.type=="Dragon"){
        res *= 1.3;
    }
    if(pokemonAbility=="Pixilate" && moveInfo.type=="Fairy"){
        res *= 1.2;
    }
    if(pokemonAbility=="Normalize" && moveInfo.type=="Normal"){
        res *= 1.2;
    }
    if(pokemonAbility=="Aerilate" && moveInfo.type=="Fly"){
        res *= 1.2;
    }
    if(pokemonAbility=="Refrigerate" && moveInfo.type=="Ice"){
        res *= 1.2;
    }
    if(item=="muscleband" && moveInfo.category=="Physical"){
        res *= 1.1;
    }
    if(item=="wiseglasses" && moveInfo.category=="Special"){
        res *= 1.1;
    }
    if(item=="punchingglove" && moveInfo.flags.hasOwnProperty("punch")){
        res *= 1.1;
    }
    if(pokemonAbility=="Iron Fist" && moveInfo.flags.hasOwnProperty("punch")){
        res *= 1.2;
    }
    if(moveInfo.type=="Electric" && ground.field["move: Electric Terrain"]==true){
        res *= 1.3;
    }
    if(moveInfo.type=="Grass" && ground.field["move: Grassy Terrain"]==true){
        res *= 1.3;
    }
    if(moveInfo.type=="Psychic" && ground.field["move: Psychic Terrain"]==true){
        res *= 1.3;
    }
    if(moveInfo.type=="Dragon" && ground.field["move: Misty Terrain"]==true){
        res *= 0.5;
    }
    if(ground.field["move: Grassy Terrain"]==true && (move=="Earthquake" || move=="Bulldoze" || move=="Magnitude")){
        res *= 0.5;
    }
    return res
}

function getWeatherMultiplier(type,weather){
    let multiplier = 1;
    if(weather=="SunnyDay"){
        if(type=="Fire"){
            multiplier = 1.5;
        }else if(type=="Water"){
            multiplier = 0.5;
        }
    }
    if(weather=="RainDance"){
        if(type=="Fire"){
            multiplier = 0.5;
        }else if(type=="Water"){
            multiplier = 1.5;
        }
    }
    //Check
    if(weather=="Harsh Sunlight"){
        if(type=="Fire"){
            multiplier = 1.5;
        }else if(type=="Water"){
            multiplier = 0;
        }
    }
    //Check
    if(weather=="Heavy Rain"){
        if(type=="Fire"){
            multiplier = 0;
        }else if(type=="Water"){
            multiplier = 1.5;
        }
    }
    return multiplier
}

function getTypeMultiplier(moveType,targetTypes,moveName,targetAbility,targetVolatileStatus, targetItem){
    let res = 1;
    let immune = 1;
    const itemName = targetItem.toLowerCase().replace(/\s/g, '');
    if(moveName==="Flying Press"){
        res = flyingPress(targetTypes);
    }else{
        for(let i = 0; i<targetTypes.length;i++){
            if(typeChart[targetTypes[i]]['resistances'].includes(moveType)){
                res /= 2;
            }
            if(typeChart[targetTypes[i]]['weaknesses'].includes(moveType)){
                res *= 2;
            }
            if(typeChart[targetTypes[i]]['immunities'].includes(moveType)){
                immune = 0;
            }
            if((targetAbility==="Levitate" || itemName==="airballoon") && moveType==="Ground"){
                immune = 0;
            }
            if(targetTypes[i]==="Water" && moveName ==="Freeze-Dry"){
                res *= 4;
            }
            if(targetTypes[i]==="Fly" && (moveName ==="Thousand Arrows" || (targetVolatileStatus.includes("Grounded") && moveType==="Ground"))){
                immune = 1;
            }
            res *= immune;
        }
    }
    return res
}

function flyingPress(targetTypes){
    let res = 1;
    let immune = 1;
    const moveTypes = ["Fighting","Fly"];
    for(let i = 0; i<targetTypes.length;i++){
        for(let j=0; j < 2; j++){
            if(typeChart[targetTypes[i]]['resistances'].includes(moveTypes[j])){
                res /= 2;
            }
            if(typeChart[targetTypes[i]]['weaknesses'].includes(moveTypes[j])){
                res *= 2;
            }
            if(typeChart[targetTypes[i]]['immunities'].includes(moveTypes[j])){
                immune = 0;
            }
        }
    }
    return res*immune
}

stream.write(`>start {"formatid":"gen9randombattle"}`);
stream.write(`>player p1 {"name":"Alice"}`);
stream.write(`>player p2 {"name":"Bob"}`);

stream.write(`>p1 move 1`)
stream.write(`>p2 move 2`)

stream.write(`>p1 move 1`)
stream.write(`>p2 switch 6`)


/*Calculate the damage inflicted to an ennemy

Where:
level -- level of attacking pokemon
offense -- attack or special attack of the attacking pokemon
defense -- defense or special defense of the defending pokemon
basePower -- base power of the move used
targets -- 1, 0.75 or 0.5 depending on the number of targets
weather -- 1.5, 1 or 0.5 depending on the current weather
badge -- deprecated factor, 1.25 in Gen 2, 1 elsewhere
critical -- 1.5 if attack lands as a critical hit, 1 otherwise
stab -- Same Type Attack Bonus, 1, 1.5 or 2 depending on attackingif(targetAbility=="Fluffy" && moveInfo.flags.hasOwnProperty("contact")){
        res *= 0.5;
    } pokemon type and ability
type -- effectiveness of a move towards the defending pokemon
burn -- 0.5 if the attacking pokemon is burned and uses a physical move, 1 otherwise
other -- 1 by default, miscellaneous  factors determined by specific moves, abilities or items
Return: damage received by the defending pokemon
*/
function calculateDamage(level, offense, defense, basePower, targets, weather, badge, critical, stab, type, burn, other) {
    let baseDamage = Math.floor(Math.floor((2 * level / 5 + 2) * basePower * offense / defense) / 50 + 2);
    let multipliers = targets * weather * badge * critical * stab * type * burn * other;
    let rolls = [];
    for (let i = 0; i < 16; i++) {
        rolls.push(Math.floor(baseDamage * multipliers * (0.85 + i / 100)));
    }
    return rolls
}

/*Calculate the offensive stat of an ennemy depending on the damage he inflicted

Where:
damage -- damage inflicted by the attacking pokemon
level -- level of attacking pokemon
defense -- defense or special defense of the defending pokemon
basePower -- base power of the move used
targets -- 1, 0.75 or 0.5 depending on the number of targets
weather -- 1.5, 1 or 0.5 depending on the current weather
badge -- deprecated factor, 1.25 in Gen 2, 1 elsewhere
critical -- 1.5 if attack lands as a critical hit, 1 otherwise
stab -- Same Type Attack Bonus, 1, 1.5 or 2 depending on attacking pokemon type and ability
type -- effectiveness of a move towards the defending pokemon
burn -- 0.5 if the attacking pokemon is burned and uses a physical move, 1 otherwise
other -- 1 by default, miscellaneous  factors determined by specific moves, abilities or items
Return: damage received by the defending pokemon
*/
function findOffense(damage,level,defense,basePower,targets,weather,badge,critical,stab,type,burn,other){
    const multipliers = targets * weather * badge * critical * stab * type * burn * other
    const a = basePower * Math.floor(2*level/5 +2)
    rolls = {
        "max":Math.floor((50*defense * (damage/(multipliers*0.85)-2)) /a),
        "min":Math.floor((50*defense * (damage/multipliers-2)) /a)
    }
    return rolls
}

/*Calculate the defensive stat of an ennemy depending on the damage he received

Where:
damage -- damage received by the defending pokemon
level -- level of attacking pokemon
offense -- attack or specil attack of the attacking pokemon
basePower -- base power of the move used
targets -- 1, 0.75 or 0.5 depending on the number of targets
weather -- 1.5, 1 or 0.5 depending on the current weather
badge -- deprecated factor, 1.25 in Gen 2, 1 elsewhere
critical -- 1.5 if attack lands as a critical hit, 1 otherwise
stab -- Same Type Attack Bonus, 1, 1.5 or 2 depending on attacking pokemon type and ability
type -- effectiveness of a move towards the defending pokemon
burn -- 0.5 if the attacking pokemon is burned and uses a physical move, 1 otherwise
other -- 1 by default, miscellaneous  factors determined by specific moves, abilities or items
Return: damage received by the defending pokemon
*/
function findDefense(damage,level,offense,basePower,targets,weather,badge,critical,stab,type,burn,other){
    const multipliers = targets * weather * badge * critical * stab * type * burn * other
    const a = basePower * Math.floor(2*level/5 +2) * offense
    rolls = {
        "min":Math.floor(a/(50*(damage/(multipliers * 0.85) - 2))),
        "max":Math.floor(a/(50*(damage/multipliers - 2)))
    }
    return rolls
}

function findAbilityAndPokemon(log) {
    const abilityRegex = /ability|\S+ability/;

    for (const entry of log) {
        const abilityMatch = entry.match(abilityRegex);
        if (abilityMatch) {
            const pokemonRegex = /([p1p2]+)a: ([a-zA-Z0-9_ -]+)/;
            const pokemonMatch = entry.match(pokemonRegex);

            if (pokemonMatch) {
                const player = pokemonMatch[1];
                const pokemon = pokemonMatch[2];
                if (player==='p2'){
                    datap2 = gameStateP2.yourTeam.pokemons;
                    for (const [pokemonName, pokemonInfo] of Object.entries(datap2) ){

                        if (pokemonName.includes(pokemon)){
                            ability = pokemonInfo.ability;
                            fullname = pokemonName;
                        }
                    }
                    gameStateP1.ennemyTeam.pokemons[fullname].abilities = {'0':ability};
                }
                if (player==='p1'){
                    datap2 = gameStateP1.yourTeam.pokemons;
                    for (const [pokemonName, pokemonInfo] of Object.entries(datap2) ){

                        if (pokemonName.includes(pokemon)){
                            ability = pokemonInfo.ability;
                            fullname = pokemonName;
                        }
                    }
                    gameStateP2.ennemyTeam.pokemons[fullname].abilities = {'0':ability};
                }
            }
        }
    }
}

//console.log(dmgCalculation(100.0,100.0,100.0,90.0,1.0,1.0,1.0,1.0,1.5,0.5,1.0,1.0))
//console.log(findOffense(49.0,100.0,100.0,90.0,1.0,1.0,1.0,1.0,1.5,0.5,1.0,1.0))
//console.log(findDefense(49.0,100.0,100.0,90.0,1.0,1.0,1.0,1.0,1.5,0.5,1.0,1.0))