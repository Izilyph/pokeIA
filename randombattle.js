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
class Game {
    stream;
    player1;
    player2;
    gameStateP1 = {
        "game_id" : 0,
        "yourTeam": {
            "active": {},
            "pokemons": {}
        },
        "ennemyTeam": {
            "active": {},
            "pokemons": {}
        },
        "weather": "None",
        "ground": {
            "hazards": {},
            "field": {}
        },
        "damageCalc": {
            "pokemon": {},
            "target": {},
            "minInv": [],
            "maxInv": []
        },
    };
    gameStateP2 = {
        "game_id" : 0,
        "yourTeam": {
            "active": {},
            "pokemons": {}
        },
        "ennemyTeam": {
            "active": {},
            "pokemons": {}
        },
        "weather": "None",
        "ground": {
            "hazards": {},
            "field": {}
        },
        "damageCalc": {
            "minInv": [],
            "maxInv": []
        },
    };
    lengthbuf;
    get player1() {
        return this.player1;
    }
    get player2() {
        return this.player2;
    }

    writeMove(str){
        this.stream.write(str);
    }
    constructor(player1,player2,gameid) {
        this.player1=player1;
        this.player2=player2;
        this.gameStateP1['game_id'] = gameid;
        this.gameStateP2['game_id'] = gameid;
        this.stream = new Sim.BattleStream();

        this.stream.write(`>start {"formatid":"gen9randombattle"}`);
        this.stream.write(`>player p1 {"name":"Alice"}`);
        this.stream.write(`>player p2 {"name":"Bob"}`);
        this.lengthbuf=this.stream.buf.length

        this.doTurn(this.stream.buf.slice(0,5));
    }



    handleBtwnTurn() {
        const clength = this.stream.buf.length;
        if (clength > this.lengthbuf) {
            if (clength - this.lengthbuf === 1) {
                this.lengthbuf = clength;
                this.handleErrorGame(this.stream.buf[clength - 1])
            } else {
                this.lengthbuf = clength;
                this.doTurn(this.stream.buf.slice(this.lengthbuf - 3, this.lengthbuf))
            }
        }
    }


    handleErrorGame(bufElement) {
        console.log(bufElement,JSON.stringify(this.gameStateP1),JSON.stringify(this.gameStateP2))
        if (!bufElement.includes("|error|[Invalid choice] Can't do anything: It's not your turn")){
            if (bufElement.includes("p1")){
                this.player1.send(JSON.stringify(this.gameStateP1));
            } else {
                this.player2.send(JSON.stringify(this.gameStateP2));
            }
        }
    }

    doTurn(turn) {
        for (const output of turn) {
            if (output.includes("|request|")) {
                const requestString = output.slice(output.indexOf("|request|") + "|request|".length);
                let teamState = JSON.parse(requestString);
                if (teamState.side.id == 'p1') {
                    this.parsePokemons(this.gameStateP1, this.gameStateP2, teamState);
                    //console.log(gameStateP2.ennemyTeam.pokemons);
                    //console.log(gameStateP1.yourTeam.pokemons[Object.keys(gameStateP1.yourTeam.pokemons)[0]].ability)

                } else {
                    this.parsePokemons(this.gameStateP2, this.gameStateP1, teamState);
                }
            }
            this.getPossibleDamage(this.gameStateP1);
            this.getPossibleDamage(this.gameStateP2);
            if (output.includes("|t:|")) {
                const updates = output.slice(output.indexOf("update") + "update".length).split('\n');


                this.findAbilityAndPokemon(updates, this.gameStateP1, this.gameStateP2);
                for (let line of updates) {
                    this.gameStateP1.weather = (line.startsWith("|-weather|") ? updates.slice(updates.indexOf("|-weather|") + "|-weather|".length) : "None");
                    if (line.startsWith("|-sidestart|")) {
                        const infos = line.split("|");
                        const side = infos[1];
                        const condition = infos[2];
                        if (side.includes("p1")) {
                            this.gameStateP1.ground.hazards[condition] = true;
                        } else {
                            this.gameStateP2.ground.hazards[condition] = true;
                        }
                    }
                    if (line.startsWith("|-sideend|")) {
                        const infos = line.split("|");
                        const side = infos[1];
                        const condition = infos[2];
                        if (side.includes("p1")) {
                            this.gameStateP1.ground.hazards[condition] = false;

                        } else {
                            this.gameStateP2.ground.hazards[condition] = false;
                        }
                    }
                    if (line.startsWith("|-fieldstart|")) {
                        const condition = line.split("|")[1];
                        this.gameStateP1.ground.field[condition] = true;
                        this.gameStateP2.ground.field[condition] = true;
                    }
                    if (line.startsWith("|-fieldend|")) {
                        const condition = line.split("|")[1];
                        this.gameStateP1.ground.field[condition] = false;
                        this.gameStateP2.ground.field[condition] = false;
                    }
                    if (line.startsWith("|move|")) {
                        const move = line.slice(1).split(/[|:]/);
                        if (move[1] == "p1a") {
                            this.updateMoves(this.gameStateP2, move);
                        } else if (move[1] == "p2a") {
                            this.updateMoves(this.gameStateP1, move);
                        }
                    }
                    if (line.startsWith("|-damage") || line.startsWith("|-heal|")) {
                        if (line.includes('/100')) {
                            const damage = line.slice(1).split(/[|:]/);
                            if (damage[1] == "p1a") {
                                this.updateHP(this.gameStateP2, damage);
                            } else if (damage[1] == "p2a") {
                                this.updateHP(this.gameStateP1, damage);
                            }
                        }
                    }
                    if (line.startsWith("|-item|")) {
                        const item = line.slice(1).split(/[|:]/);
                        if (item[1] == "p1a") {
                            this.updateItem(this.gameStateP2, item, false);
                        } else if (item[1] == "p2a") {
                            this.updateItem(this.gameStateP1, item, false);
                        }
                    }
                    if (line.startsWith("|-enditem|")) {
                        const item = line.slice(1).split(/[|:]/);
                        if (item[1] == "p1a") {
                            this.updateItem(this.gameStateP2, item, true);
                        } else if (item[1] == "p2a") {
                            this.updateItem(this.gameStateP1, item, true);
                        }
                    }
                    if (line.startsWith("|-boost|")) {
                        const boost = line.slice(1).split(/[|:]/);
                        if (boost[1] == "p1a") {
                            this.updateStats(this.gameStateP2, boost, true);
                        } else if (boost[1] == "p2a") {
                            this.updateStats(this.gameStateP1, boost, true);
                        }
                    }
                    if (line.startsWith("|-unboost|")) {
                        const unboost = line.slice(1).split(/[|:]/);
                        if (unboost[1] == "p1a") {
                            this.updateStats(this.gameStateP2, unboost, false);
                        } else if (unboost[1] == "p2a") {
                            this.updateStats(this.gameStateP1, unboost, false);
                        }
                    }
                    if (line.startsWith("|-status|")) {
                        const status = line.slice(1).split(/[|:]/);
                        if (status[1] == "p1a") {
                            this.updateStatus(this.gameStateP2, status, false);
                        } else if (status[1] == "p2a") {
                            this.updateStatus(this.gameStateP1, status, false);
                        }
                    }
                    if (line.startsWith("|-curestatus|")) {
                        const status = line.slice(1).split(/[|:]/);
                        if (status[1] == "p1a") {
                            this.updateStatus(this.gameStateP2, status, true);
                        } else if (status[1] == "p2a") {
                            this.updateStatus(this.gameStateP1, status, true);
                        }
                    }
                    if (line.startsWith("|-cureteam|")) {
                        const cure = line.slice(1).split(/[|:]/);
                        if (cure[1] == "p1a") {
                            this.cureAllStatus(this.gameStateP2);
                        } else if (cure[1] == "p2a") {
                            this.cureAllStatus(this.gameStateP1);
                        }
                    }
                    if (line.startsWith("|-start|")) {
                        const volatileStatus = line.slice(1).split(/[|:]/);
                        if (volatileStatus[1] == "p1a") {
                            this.updateVolatileStatus(this.gameStateP2, volatileStatus, false);
                        } else if (volatileStatus[1] == "p2a") {
                            this.updateVolatileStatus(this.gameStateP1, volatileStatus, false);
                        }
                    }
                    if (line.startsWith("|-end|")) {
                        const volatileStatus = line.slice(1).split(/[|:]/);
                        if (volatileStatus[1] == "p1a") {
                            this.updateVolatileStatus(this.gameStateP2, volatileStatus, true);
                        } else if (volatileStatus[1] == "p2a") {
                            this.updateVolatileStatus(this.gameStateP1, volatileStatus, true);

                        }
                    }
                    if (line.startsWith("|-ability|")) {
                        const ability = line.slice(1).split(/[|:]/);
                        if (ability[1] == "p1a") {
                            this.updateAbility(this.gameStateP2, ability);
                        } else if (ability[1] == "p2a") {
                            this.updateAbility(this.gameStateP1, ability);
                        }
                    }
                }
            }

            if (output.includes("|error|")) {
                const errorString = output.slice(output.indexOf("|error|"));
                //console.log(errorString);
            }
            //fs.writeFileSync('gameStateP1.json',JSON.stringify(gameStateP1,null,2),'utf-8');
            //fs.writeFileSync('gameStateP2.json',JSON.stringify(gameStateP2,null,2),'utf-8');

        }
        this.player1.send(JSON.stringify(this.gameStateP1));
        this.player2.send(JSON.stringify(this.gameStateP2));
    }

    parsePokemons(gameState1,gameState2,team){
        team.side.pokemon.forEach(pokemon => {
            const details = pokemon.details.split(',');
            const dexDetails = Dex.species.get(details[0]);
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
                "ability":Dex.abilities.get(pokemon.ability),
                "item":pokemon.item,
                "types":dexDetails.types
            };
            if(pokemon.active){
                gameState1.yourTeam.active = gameState1.yourTeam.pokemons[details[0]];
                if(!gameState2.ennemyTeam.pokemons.hasOwnProperty(details[0])){
                    gameState2.ennemyTeam.pokemons[details[0]] = {
                        "types":dexDetails.types,
                        "abilities":dexDetails.abilities,
                        "estimatedStats":dexDetails.baseStats,
                        "moves":{},
                        "currentHP":100,
                        "item":"unknown",
                        "status":"None",
                        "volatileStatus":[]
                    }
                }
                gameState2.ennemyTeam.active = gameState2.ennemyTeam.pokemons[details[0]]
            }
        });
    }

    updateMoves(gameState,move){
        const moveName = move[3];
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(move[2].slice(1)));
        const enemyPokemon = gameState.ennemyTeam.pokemons[pokemonName];
        let moveInfo = enemyPokemon.moves[moveName];
        if (moveInfo === undefined) {
            moveInfo ??= { "pp": Dex.moves.get(moveName).pp };
        } else {
            moveInfo.pp -= 1;
        }
        gameState.ennemyTeam.pokemons[pokemonName].moves[moveName] = moveInfo;
    }

    updateAbility(gameState,ability){
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(ability[2].slice(1)));
        gameState.ennemyTeam.pokemons[pokemonName].abilities = {'0':ability[3]};
    }

    updateStatus(gameState,status,hasRecovered){
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(status[2].slice(1)));
        gameState.ennemyTeam.pokemons[pokemonName].status = (hasRecovered ? "None" : status[3]);
    }

    cureAllStatus(gameState){
        for(let pokemon in gameState.ennemyTeam.pokemons){
            pokemon.status = "None";
        }
    }

    updateVolatileStatus(gameState,volatileStatus,hasEnded){
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(volatileStatus[2].slice(1)));
        if(hasEnded){
            const endType = volatileStatus[3];

        }else{
            gameState.ennemyTeam.pokemons[pokemonName].volatileStatus.push(volatileStatus[4]);

        }
    }

    updateStats(gameState,boost,isBoost){
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(boost[2].slice(1)));
        const stat = boost[3];
        const boostValue = parseInt(boost[4]);
        const pokemonStat = gameState.ennemyTeam.pokemons[pokemonName].estimatedStats[stat];
        let res = 0;
        if(isBoost){
            res = Math.floor(pokemonStat * (boostValue+2)/2);
        }else{
            res = Math.floor(pokemonStat * 2/(boost + 2));
        }
        gameState.ennemyTeam.pokemons[pokemonName].estimatedStats[stat] = res;
    }

    updateItem(gameState,item,endItem){
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(item[2].slice(1)));
        gameState.ennemyTeam.pokemons[pokemonName].item = (endItem ? "None" : item[3]);
    }

    updateHP(gameState,damage){
        const hp = damage[3].split('/');
        const currentHp = parseInt(hp[0]);
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(damage[2].slice(1)));
        gameState.ennemyTeam.pokemons[pokemonName].currentHP = currentHp;
    }

    getStat(baseStat,iv,ev,level,nature){
        return (Math.floor(0.01 *(2 * baseStat + iv + Math.floor(0.25 * ev))*level) + 5) * nature
    }

    getHp(baseHP,iv,ev,level){
        return Math.floor(0.01 * (2 * baseHP + iv + Math.floor(0.25 * ev)) * level) + level + 10
    }

    getPossibleDamage(gameState){
        let damages;
        damages = [];
        const pokemon = gameState.yourTeam.active;
        const target = gameState.ennemyTeam.active;
        gameState.damageCalc.pokemon = pokemon.name;
        gameState.damageCalc.target = target.name;
        if(Object.keys(target).length!=0 && Object.keys(pokemon).length!=0){
            pokemon.moves.forEach(move => {
                const bp = move.basePower;
                if(bp!=0){
                    const dexInfos = Dex.species.get(target.name);
                    const lv = parseInt(pokemon.lv);
                    const off = (move.category == 'Physical' ? pokemon.stats['atk'] : pokemon.stats['spa']);
                    const def = (move.category == 'Physical' ? dexInfos.baseStats['def'] : dexInfos.baseStats['spd']);
                    const stab = (pokemon.types.includes(move.type) ? 1.5 : 1);
                    const weather = this.getWeatherMultiplier(move.type,gameState.weather);
                    const burn = ((move.category=='Physical' && pokemon.condition.includes("brn")) ? 0.5 : 1);
                    const type = this.getTypeMultiplier(move.type,target.types);
                    gameState.damageCalc.minInv[move.name] = this.calculateDamage(lv, off, this.getStat(def,31,0,parseInt(target.lv),1), bp, 1, weather, 1, 1, stab, type, burn, 1)
                        .map(dmg => Math.floor(100 * (dmg/this.getHp(dexInfos.baseStats['hp'],31,0,parseInt(target.lv)))));
                    gameState.damageCalc.maxInv[move.name] = this.calculateDamage(lv, off, this.getStat(def,31,252,target.lv,1), bp, 1, weather, 1, 1, stab, type, burn, 1)
                        .map(dmg => Math.floor(100 * (dmg/this.getHp(dexInfos.baseStats['hp'],31,252,parseInt(target.lv)))));

                }

            });
        }
    }

    getWeatherMultiplier(type,weather){
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

    getTypeMultiplier(moveType,targetTypes){
        let res = 1;
        let immune = 1;
        for(let i = 0; i<targetTypes.length;i++){
            if(typeChart[targetTypes[i]]['resistances'].includes(moveType)){
                res = res / 2;
            }
            if(typeChart[targetTypes[i]]['weaknesses'].includes(moveType)){
                res = res * 2;
            }
            if(typeChart[targetTypes[i]]['immunities'].includes(moveType)){
                immune = 0;
            }
        }
        return res*immune
    }



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
    stab -- Same Type Attack Bonus, 1, 1.5 or 2 depending on attacking pokemon type and ability
    type -- effectiveness of a move towards the defending pokemon
    burn -- 0.5 if the attacking pokemon is burned and uses a physical move, 1 otherwise
    other -- 1 by default, miscellaneous  factors determined by specific moves, abilities or items
    Return: damage received by the defending pokemon
    */
    calculateDamage(level, offense, defense, basePower, targets, weather, badge, critical, stab, type, burn, other) {
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
    findOffense(damage,level,defense,basePower,targets,weather,badge,critical,stab,type,burn,other){
        const multipliers = targets * weather * badge * critical * stab * type * burn * other
        const a = basePower * Math.floor(2*level/5 +2)
        let rolls;
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
    findDefense(damage,level,offense,basePower,targets,weather,badge,critical,stab,type,burn,other){
        const multipliers = targets * weather * badge * critical * stab * type * burn * other
        const a = basePower * Math.floor(2*level/5 +2) * offense
        let rolls;
        rolls = {
            "min":Math.floor(a/(50*(damage/(multipliers * 0.85) - 2))),
            "max":Math.floor(a/(50*(damage/multipliers - 2)))
        }
        return rolls
    }

    findAbilityAndPokemon(log, gameStateP1,gameStateP2) {
        const abilityRegex = /ability|\S+ability/;

        for (const entry of log) {
            const abilityMatch = entry.match(abilityRegex);
            if (abilityMatch) {
                const pokemonRegex = /(\w+)a: (\w+)/;
                const pokemonMatch = entry.match(pokemonRegex);

                if (pokemonMatch) {
                    const player = pokemonMatch[1];
                    const pokemon = pokemonMatch[2];
                    if (player==='p2'){
                        let datap2;
                        let ability;
                        let fullname;
                        datap2 = gameStateP2.yourTeam.pokemons;
                        for (const [pokemonName, pokemonInfo] of Object.entries(datap2) ){

                            if (pokemonName.includes(pokemon)){

                                ability = pokemonInfo.ability;

                                fullname = pokemonName;
                            }
                        }
                        gameStateP1.ennemyTeam.pokemons[fullname].abilities = {'0':ability.name};
                    }
                    if (player==='p1'){
                        let datap1;
                        let ability;
                        let fullname;
                        datap1 = gameStateP1.yourTeam.pokemons;
                        for (const [pokemonName, pokemonInfo] of Object.entries(datap1) ){

                            if (pokemonName.includes(pokemon)){
                                ability = pokemonInfo.ability;
                                fullname = pokemonName;
                            }
                        }
                        gameStateP2.ennemyTeam.pokemons[fullname].abilities = {'0':ability.name};
                    }
                }
            }
        }
    }
//console.log(dmgCalculation(100.0,100.0,100.0,90.0,1.0,1.0,1.0,1.0,1.5,0.5,1.0,1.0))
//console.log(findOffense(49.0,100.0,100.0,90.0,1.0,1.0,1.0,1.0,1.5,0.5,1.0,1.0))
//console.log(findDefense(49.0,100.0,100.0,90.0,1.0,1.0,1.0,1.0,1.5,0.5,1.0,1.0))
}


module.exports = { Game };