const Sim = require('pokemon-showdown');
const {Dex} = require('pokemon-showdown');

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


const selfDamagingMoves = [
    "Substitute",
    "Belly Drum",
    "Shed Tail",
    "Clangorous Soul",
    "Curse",
    "Fillet Away",
]
const trapAbilities = [
    "Arena Trap",
    "Magnet Pull",
    "Shadow Tag"
]

const trapMoves = [
    "Spirit Shackle",
    "No Retreat",
    "Mean Look",
    "Jaw Lock",
    "Ingrain",
    "Fairy Lock",
    "Block",
]

const switchingMoves = [
    "Shed Tail",
    "U-turn",
    "Volt Switch",
    "Baton Pass",
    "Chilly Reception",
    "Flip Turn",
    "Parting Shot",
    "U-turn"
];

class Game {
    stream;
    ws;
    gameStateP1 = {
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
        "battleState":"running",
        "weather":"None",
        "ground":{
            "hazards":{},
            "field":{}
        },
        "damageCalc":{
            "pokemon":"",
            "target":"",
            "minInv": {},
            "maxInv": {}
        },
    };
    gameStateP2 = {
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
        "battleState":"running",
        "weather":"None",
        "ground":{
            "hazards":{},
            "field":{}
        },
        "damageCalc":{
            "pokemon":"",
            "target":"",
            "minInv":{},
            "maxInv":{}
        },
    };
    lengthbuf;
    gameid;
    possibilitiesP1= {"move":[],"switch":[]};
    possibilitiesP2= {"move":[],"switch":[]};


    writeMove(str){
        this.stream.write(str);
    }
    constructor(ws,gameid) {
        this.gameid = gameid;
        this.ws=ws;
        this.stream = new Sim.BattleStream();

        this.stream.write(`>start {"formatid":"gen9randombattle"}`);
        this.stream.write(`>player p1 {"name":"p1"}`);
        this.stream.write(`>player p2 {"name":"p2"}`);
        this.lengthbuf=this.stream.buf.length

        this.doTurn(this.stream.buf.slice(0,5));
    }



    handleBtwnTurn() {
        const clength = this.stream.buf.length;
        if (clength > this.lengthbuf) {
            if (clength - this.lengthbuf === 1) {
                this.lengthbuf = clength;
                this.handleErrorGame(this.stream.buf.slice(this.lengthbuf - 2, this.lengthbuf))
            } else if (clength - this.lengthbuf === 2) {
                this.lengthbuf = clength;
                const output  = this.stream.buf.slice(this.lengthbuf - 2, this.lengthbuf)[0];
                const updates = output.slice(output.indexOf("update") + "update".length).split('\n');
                for (let line of updates) {
                    if (line.startsWith("|win|")) {
                        const win = line.slice(1).split(/[|:]/);
                        if (win[1] === "p1") {
                            this.gameStateP1.battleState = "win";
                            this.gameStateP2.battleState = "loose";
                        } else if (win[1] === "p2") {
                            this.gameStateP2.battleState = "win";
                            this.gameStateP1.battleState = "loose";
                        }
                        this.sendToPlayer("p1", this.gameStateP1, this.possibilitiesP1, "end");
                        this.sendToPlayer("p2", this.gameStateP2, this.possibilitiesP2, "end");
                        this.ws.close();
                    }
                    if (line.startsWith("|tie|")) {
                        const tie = line.slice(1).split(/[|:]/);
                        this.gameStateP2.battleState = "tie";
                        this.gameStateP1.battleState = "tie";

                        this.sendToPlayer("p1", this.gameStateP1, this.possibilitiesP1, "end");
                        this.sendToPlayer("p2", this.gameStateP2, this.possibilitiesP2, "end");
                    }
                }
            }else{
                this.lengthbuf = clength;
                this.doTurn(this.stream.buf.slice(this.lengthbuf - 3, this.lengthbuf))
            }

        }
    }


    handleErrorGame(bufElement) {
        if (bufElement.includes("|error|[Invalid choice] Can't switch: The active Pokémon is trapped")){
            if (bufElement.includes("p1")){
                if (trapAbilities.includes(this.gameStateP2.yourTeam.active.ability)){
                    this.gameStateP1['ennemyTeam']['pokemons'][this.gameStateP2['yourTeam']['active']['name']]['abilities'] = this.gameStateP2['yourTeam']['active']['ability'];
                    this.gameStateP1['ennemyTeam']['active']['abilities'] = this.gameStateP2['yourTeam']['active']['abilities'];
                    this.gameStateP1['yourTeam']['active']['trapped']=true;
                }
                this.sendToPlayer("p1",this.gameStateP1,this.possibilitiesP1,"play");
                this.sendToPlayer("p2",this.gameStateP2,this.possibilitiesP2,"wait");

            } else {
                if (trapAbilities.includes(this.gameStateP1.yourTeam.active.ability)){
                    this.gameStateP2['ennemyTeam']['pokemons'][this.gameStateP1['yourTeam']['active']['name']]['abilities'] = this.gameStateP1['yourTeam']['active']['ability']
                    this.gameStateP2['ennemyTeam']['active']['abilities'] = this.gameStateP1['yourTeam']['active']['abilities']
                    this.gameStateP2['yourTeam']['active']['trapped']=true;
                }
                this.sendToPlayer("p1",this.gameStateP1,this.possibilitiesP1,"wait");
                this.sendToPlayer("p2",this.gameStateP2,this.possibilitiesP2,"play");
            }
        }
    }

    doTurn(turn) {
        let typeTurnP1 = undefined;
        let typeTurnP2 = undefined;

        for (const output of turn) {
            console.log(output);
            if(output.includes("|request|")){
                const requestString = output.slice(output.indexOf("|request|") + "|request|".length);
                let teamState;
                teamState = JSON.parse(requestString);

                if(teamState.wait==undefined){
                    if(teamState.forceSwitch){
                        if(teamState.side.id == 'p1'){
                            typeTurnP1 = "switch";
                        }else{
                            typeTurnP2 = "switch";
                        }
                    }
                    if(teamState.active){
                        typeTurnP1 = "play";
                        typeTurnP2 = "play";
                    }
                } else if(teamState.side.id == 'p1'){
                    typeTurnP1 = "wait";
                }else{
                    typeTurnP2 = "wait";
                }
                if(teamState.side.id == 'p1'){
                    this.parsePokemons(this.gameStateP1,this.gameStateP2,teamState,typeTurnP1);
                }else{
                    this.parsePokemons(this.gameStateP2,this.gameStateP1,teamState,typeTurnP2);
                }
            }
            if(output.includes("|t:|")){
                const updates = output.slice(output.indexOf("update") + "update".length).split('\n');

                for (let line of updates) {
                    this.gameStateP1.weather = (line.startsWith("|-weather|") ? updates.slice(updates.indexOf("|-weather|")+ "|-weather|".length): "None");
                    if(line.startsWith("|-sidestart|")){
                        const infos = line.slice(1).split(/[|:]/);
                        if(infos[1]==="p1a"){
                            this.gameStateP1.ground.hazards[infos[4]] = true;
                        }else if(infos[1]==="p2a"){
                            this.gameStateP2.ground.hazards[infos[4]] = true;
                        }
                    }
                    if(line.startsWith("|-sideend|")){
                        const infos = line.slice(1).split(/[|:]/);
                        if(infos[1]==="p1a"){
                            this.gameStateP1.ground.hazards[infos[4]] = false;
                        }else if(infos[1]==="p2a"){
                            this.gameStateP2.ground.hazards[infos[4]] = false;
                        }
                    }
                    if(line.startsWith("|-fieldstart|")){
                        const condition = line.slice(1).split(/[|:]/)[2];
                        this.gameStateP1.ground.field[condition] = true;
                        this.gameStateP2.ground.field[condition] = true;
                    }
                    if(line.startsWith("|-fieldend|")){
                        const condition = line.slice(1).split(/[|:]/)[2];
                        this.gameStateP1.ground.field[condition] = false;
                        this.gameStateP2.ground.field[condition] = false;
                    }
                    if(line.startsWith("|move|")){
                        const move = line.slice(1).split(/[|:]/);
                        if(move[1]=="p1a"){
                            this.updateMoves(this.gameStateP2,this.gameStateP1,move);
                            if (move[3] == "Revival Blessing" && move[5]!="[still]"){
                                typeTurnP1="revival";
                            }
                        }else if(move[1]=="p2a"){
                            this.updateMoves(this.gameStateP1,this.gameStateP2,move);
                            if (move[3] == "Revival Blessing" && move[5]!="[still]"){
                                typeTurnP2="revival";
                            }
                        }
                    }
                    if(line.startsWith("|-anim|")){
                        const anim = line.slice(1).split(/[|:]/);
                        if(anim[1]=="p1a"){
                            this.updateLastMove(this.gameStateP2,this.gameStateP1,anim);
                        }else if(anim[1]=="p2a"){
                            this.updateLastMove(this.gameStateP1,this.gameStateP2,anim);
                        }
                    }
                    if(line.startsWith("|-damage") || line.startsWith("|-heal|")){
                        if(line.includes('/100') || line.includes('fnt')){
                            const damage = line.slice(1).split(/[|:]/);
                            if(damage[1]=="p1a"){
                                this.updateHP(this.gameStateP2,damage);
                                const allyLastMove = this.gameStateP1.yourTeam.lastMove.moveName;
                                if(damage.length === 4 && !selfDamagingMoves.includes(allyLastMove) && damage[0]!='-heal'){
                                    this.estimateOffense(this.gameStateP1,damage,this.gameStateP1.ennemyTeam.lastMove,this.gameStateP2.ennemyTeam.active.statsModifiers);
                                    this.estimateDefense(this.gameStateP2,damage,this.gameStateP2.yourTeam.lastMove,this.gameStateP1.ennemyTeam.active.statsModifiers);
                                }
                            }else if(damage[1]==="p2a"){
                                this.updateHP(this.gameStateP1,damage);
                                const allyLastMove = this.gameStateP2.yourTeam.lastMove.moveName;
                                if(damage.length === 4 && !selfDamagingMoves.includes(allyLastMove) && damage[0]!='-heal'){
                                    this.estimateOffense(this.gameStateP2,damage,this.gameStateP2.ennemyTeam.lastMove,this.gameStateP1.ennemyTeam.active.statsModifiers);
                                    this.estimateDefense(this.gameStateP1,damage,this.gameStateP1.yourTeam.lastMove,this.gameStateP2.ennemyTeam.active.statsModifiers);
                                }
                            }
                        }
                    }
                    if(line.includes("[from] item")){
                        const revealedItem = line.slice(1).split(/[|:]/);
                        if(revealedItem[1]==="p1a"){
                            this.updateRevealedItem(this.gameStateP2,revealedItem);
                        }else if(revealedItem[1]==="p2a"){
                            this.updateRevealedItem(this.gameStateP1,revealedItem);
                        }
                    }
                    if(line.startsWith("|-item|")){
                        const item = line.slice(1).split(/[|:]/);
                        if(item[1]=="p1a"){
                            this.updateItem(this.gameStateP2,item,false);
                        }else if(item[1]=="p2a"){
                            this.updateItem(this.gameStateP1,item,false);
                        }
                    }
                    if(line.startsWith("|-enditem|")){
                        const item = line.slice(1).split(/[|:]/);
                        if(item[1]=="p1a"){
                            this.updateItem(this.gameStateP2,item,true);
                        }else if(item[1]=="p2a"){
                            this.updateItem(this.gameStateP1,item,true);
                        }
                    }
                    if(line.startsWith("|-boost|") || line.startsWith("|-setboost|")){
                        const boost = line.slice(1).split(/[|:]/);
                        if(boost[1]=="p1a"){
                            this.updateStats(this.gameStateP2,boost,true);
                        }else if(boost[1]=="p2a"){
                            this.updateStats(this.gameStateP1,boost,true);
                        }
                    }
                    if(line.startsWith("|-unboost|")){
                        const unboost = line.slice(1).split(/[|:]/);
                        if(unboost[1]=="p1a"){
                            this.updateStats(this.gameStateP2,unboost,false);
                        }else if(unboost[1]=="p2a"){
                            this.updateStats(this.gameStateP1,unboost,false);
                        }
                    }
                    if(line.startsWith("|-swapboost|")){
                        const swapboost = line.slice(1).split(/[|:]/);
                        if(swapboost[1]=="p1a"){
                            this.swapBoost(this.gameStateP2,this.gameStateP1,swapboost);
                        }else if(swapboost[1]=="p2a"){
                            this.swapBoost(this.gameStateP1,this.gameStateP2,swapboost);
                        }
                    }
                    if(line.startsWith("|-invertboost|")){
                        const invertboost = line.slice(1).split(/[|:]/);
                        if(invertboost[1]=="p1a"){
                            this.invertBoost(this.gameStateP2,invertboost);
                        }else if(invertboost[1]=="p2a"){
                            this.invertBoost(this.gameStateP1,invertboost);
                        }
                    }
                    if(line.startsWith("|-clearboost|")){
                        const clearboost = line.slice(1).split(/[|:]/);
                        if(clearboost[1]=="p1a"){
                            this.clearBoost(this.gameStateP2,clearboost);
                        }else if(clearboost[1]=="p2a"){
                            this.clearBoost(this.gameStateP1,clearboost);
                        }
                    }
                    if(line.startsWith("|-clearallboost|")){
                        this.clearAllBoost(this.gameStateP1,this.gameStateP2);
                    }
                    if(line.startsWith("|-clearpositiveboost|")){
                        const clearpositiveboost = line.slice(1).split(/[|:]/);
                        if(clearpositiveboost[1]=="p1a"){
                            this.clearPositiveBoost(this.gameStateP2,clearpositiveboost);
                        }else if(clearpositiveboost[1]=="p2a"){
                            this.clearPositiveBoost(this.gameStateP1,clearpositiveboost);
                        }
                    }
                    if(line.startsWith("|-clearnegativeboost|")){
                        const clearnegativeboost = line.slice(1).split(/[|:]/);
                        if(clearnegativeboost[1]=="p1a"){
                            this.clearNegativeBoost(this.gameStateP2,clearnegativeboost);
                        }else if(clearnegativeboost[1]=="p2a"){
                            this.clearNegativeBoost(this.gameStateP1,clearnegativeboost);
                        }
                    }
                    if(line.startsWith("|-copyboost|")){
                        const copyboost = line.slice(1).split(/[|:]/);
                        if(copyboost[1]=="p1a"){
                            this.copyBoost(this.gameStateP2,this.gameStateP1,copyboost);
                        }else if(copyboost[1]=="p2a"){
                            this.copyBoost(this.gameStateP1,this.gameStateP2,copyboost);
                        }
                    }
                    if(line.startsWith("|-status|")){
                        const status = line.slice(1).split(/[|:]/);
                        if(status[1]=="p1a"){
                            this.updateStatus(this.gameStateP2,status,false);
                        }else if(status[1]=="p2a"){
                            this.updateStatus(this.gameStateP1,status,false);
                        }
                    }
                    if(line.startsWith("|-curestatus|")){
                        const status = line.slice(1).split(/[|:]/);
                        if(status[1]=="p1a"){
                            this.updateStatus(this.gameStateP2,status,true);
                        }else if(status[1]=="p2a"){
                            this.updateStatus(this.gameStateP1,status,true);
                        }
                    }
                    if(line.startsWith("|-cureteam|")){
                        const cure = line.slice(1).split(/[|:]/);
                        if(cure[1]=="p1a"){
                            this.cureAllStatus(this.gameStateP2);
                        }else if(cure[1]=="p2a"){
                            this.cureAllStatus(this.gameStateP1);
                        }
                    }
                    if(line.startsWith("|-start|") || (line.startsWith("|-activate|") && line.includes("move"))){
                        const volatileStatus= line.slice(1).split(/[|:]/);
                        if(volatileStatus[1]=="p1a"){
                            this.updateVolatileStatus(this.gameStateP2,this.gameStateP1,volatileStatus,false);
                        }else if(volatileStatus[1]=="p2a"){
                            this.updateVolatileStatus(this.gameStateP1,this.gameStateP2,volatileStatus,false);
                        }
                    }
                    if(line.startsWith("|-end|")){
                        const volatileStatus= line.slice(1).split(/[|:]/);
                        if(volatileStatus[1]=="p1a" && volatileStatus[3]!="Illusion"){
                            this.updateVolatileStatus(this.gameStateP2,this.gameStateP1,volatileStatus,true);
                            if(line.includes("Future Sight") || line.includes("Doom Desire")){
                                this.updateChargedMove(this.gameStateP2,this.gameStateP1,volatileStatus);
                            }
                        }else if(volatileStatus[1]=="p2a" && volatileStatus[3]!="Illusion"){
                            this.updateVolatileStatus(this.gameStateP1,this.gameStateP2,volatileStatus,true);
                            if(line.includes("Future Sight") || line.includes("Doom Desire")){
                                this.updateChargedMove(this.gameStateP1,this.gameStateP2,volatileStatus);
                            }
                        }
                    }
                    if(line.startsWith("|replace|")){
                        const replace = line.slice(1).split(/[|:]/);
                        if(replace.includes(" Zoroark")){
                            let name;
                            name=replace[3].split(',');
                            if(replace[1] === "p1a"){
                                this.endIllusion(this.gameStateP2,replace);
                                this.gameStateP1.ennemyTeam.lastMove.target = name[0];
                                this.gameStateP2.yourTeam.lastMove.target = name[0];
                            }else if(replace[1] === "p2a"){
                                this.endIllusion(this.gameStateP1,replace);
                                this.gameStateP1.yourTeam.lastMove.target = name[0];
                                this.gameStateP2.ennemyTeam.lastMove.target = name[0];
                            }


                        }
                    }
                    if(line.startsWith("|-transform")){
                        const transform = line.slice(1).split(/[|:]/);
                        if(transform[1]==="p1a"){
                            this.activateTransform(this.gameStateP1,this.gameStateP2);
                        }else if(transform[1]==="p2a"){
                            this.activateTransform(this.gameStateP2,this.gameStateP1);
                        }
                    }
                    if(line.startsWith("|switch") && line.includes("/100")){
                        const switchpkmn = line.slice(1).split(/[|:]/);
                        if(switchpkmn[1]==="p1a"){
                            this.dragPokemon(this.gameStateP2,this.gameStateP1,switchpkmn);
                        }else if(switchpkmn[1]==="p2a"){
                            this.dragPokemon(this.gameStateP1,this.gameStateP2,switchpkmn);
                        }
                    }
                    if(line.startsWith("|drag|") && line.includes("/100")){
                        const drag = line.slice(1).split(/[|:]/);
                        if(drag[1]==="p1a"){
                            this.dragPokemon(this.gameStateP2,this.gameStateP1,drag);
                        }else if(drag[1]==="p2a"){
                            this.dragPokemon(this.gameStateP1,this.gameStateP2,drag);
                        }
                    }
                    if (line.startsWith("|detailschange|")){
                        const change = line.slice(1).split(/[|:]/) ;
                        if(change[1]==="p1a"){
                            this.detailschange(this.gameStateP1,this.gameStateP2,change);
                        }else if(change[1]==="p2a") {
                            this.detailschange(this.gameStateP2,this.gameStateP1,change);
                        }
                    }

                    if(line.startsWith("|turn|")){
                        const turn = line.slice(1).split("|");
                        const turnNumber = turn[1];
                    }
                }
                this.findAbilityAndPokemon(updates);
            }

        }
        this.getPossibleDamage(this.gameStateP1,this.gameStateP2.ennemyTeam.active.statsModifiers);

        this.getPossibleDamage(this.gameStateP2,this.gameStateP1.ennemyTeam.active.statsModifiers);
        this.sendToPlayer("p1",this.gameStateP1,this.possibilitiesP1,typeTurnP1);
        this.sendToPlayer("p2",this.gameStateP2,this.possibilitiesP2,typeTurnP2);
    }

    sendToPlayer(player,gameState,possibilities,typeTurn){
        if (typeTurn!="wait"){
            possibilities = this.possibilitiesMoves(gameState,typeTurn);
        }
        let data = {
            "player": player,
            "typeturn": typeTurn,
            "game_id": this.gameid,
            "gameState": gameState,
            "possibilities": possibilities
        }
        this.ws.send(JSON.stringify(data));
        gameState.damageCalc = {
            "pokemon":"",
            "target":"",
            "minInv":{},
            "maxInv":{}
        };
    }

    parsePokemons(gameState1,gameState2,team, typeTurn){
        team.side.pokemon.forEach(pokemon => {
            let details = pokemon.details.split(',');
            let dexDetails = Dex.species.get(details[0]);
            gameState1.yourTeam.pokemons[details[0]] = {
                "name":details[0],
                "lv":details[1].slice(2),
                "stats":pokemon.stats,
                "condition":pokemon.condition,
                "status":pokemon.condition.split(" ")[1] || "None",
                "moves":pokemon.moves.map(movec => {
                    let dexInfo ;
                    dexInfo  = Dex.moves.get(movec);
                    return {
                        "name":dexInfo.name,
                        "accuracy":dexInfo.accuracy,
                        "basePower":dexInfo.basePower,
                        "category":dexInfo.category,
                        "pp":(gameState1.yourTeam.pokemons[details[0]] != undefined && details[0]!= "Ditto" ? gameState1.yourTeam.pokemons[details[0]].moves.find(move => move.name=== dexInfo.name).pp : Math.floor(dexInfo.pp * 1.6)),
                        "priority":dexInfo.priority,
                        "flags":dexInfo.flags,
                        "type": dexInfo.type,
                        "status":dexInfo.status,
                        "secondary":dexInfo.secondary,
                    };
                }),
                "ability":Dex.abilities.get(pokemon.ability).name,
                "item":pokemon.item,
                "types":dexDetails.types,
                "volatileStatus":[]
            };
            if(pokemon.active){
                gameState1.yourTeam.active = JSON.parse(JSON.stringify(gameState1.yourTeam.pokemons[details[0]]));
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

                if (typeTurn=="play"){
                    gameState1.yourTeam.active.moves = team.active[0].moves.map(move => {
                        const moveName = move.move;
                        let moveInfo;
                        if(moveName!=="Recharge"){
                            const dexInfo = Dex.moves.get(moveName);
                            moveInfo = {
                                "name":moveName,
                                "accuracy":dexInfo.accuracy,
                                "basePower":dexInfo.basePower,
                                "category":dexInfo.category,
                                "pp":move.pp,
                                "priority":dexInfo.priority,
                                "flags":dexInfo.flags,
                                "type": dexInfo.type,
                                "status":dexInfo.status,
                                "secondary":dexInfo.secondary,
                                "disabled" : move.disabled
                            };
                        }else{
                            moveInfo = {
                                "name":moveName,
                                "accuracy":100,
                                "basePower":0,
                                "category":"Status",
                                "pp":1,
                                "priority":0,
                                "flags":undefined,
                                "type": "Normal",
                                "status":undefined,
                                "secondary":null,
                                "disabled" : move.disabled
                            }
                        }
                        return moveInfo;
                    })
                    for (const move of gameState1.yourTeam.active.moves) {
                        const moveFound = gameState1.yourTeam.pokemons[gameState1.yourTeam.active.name].moves.find(mv => mv.name === move.name);
                        if (moveFound !== undefined) {
                            moveFound.pp = move.pp;
                        }
                    }

                    gameState1.yourTeam.active.isTrapped = (team.active[0].trapped ? team.active[0].trapped : "false");
                }


            }else{
                if(gameState2.ennemyTeam.pokemons.hasOwnProperty(details[0])){
                    gameState2.ennemyTeam.pokemons[details[0]].statsAfterBoost = {...gameState2.ennemyTeam.pokemons[details[0]].estimatedStats};
                    gameState2.ennemyTeam.pokemons[details[0]].volatileStatus = [];
                }
                gameState1.yourTeam.pokemons[details[0]].volatileStatus = [];
            }
        });
    }

    dragPokemon(gameState1,gameState2,drag){
        const draggedPokemonName = Object.keys(gameState2.yourTeam.pokemons)
            .find(key => key.includes(drag[2].slice(1)));
        let details = drag[3].split(",");
        let dexDetails = Dex.species.get(draggedPokemonName);
        //If active pokemon is Zoroark or Zoroark-Hisui
        console.log("pokemon dragged : " )
        console.log(draggedPokemonName)
        if(gameState2.yourTeam.pokemons[draggedPokemonName].ability==="illusion" && draggedPokemonName!="Ditto"){
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
        if(drag.includes("[from] Shed Tail")){
            gameState1.ennemyTeam.pokemons[draggedPokemonName].volatileStatus = ['Substitute'];
            gameState2.yourTeam.pokemons[draggedPokemonName].volatileStatus = ['Substitute'];
        }
    }

    updateMoves(gameState1,gameState2,move){
        const moveName = move[3];
        const pokemonName = Object.keys(gameState1.ennemyTeam.pokemons)
            .find(key => key.includes(move[2].slice(1)));
        const enemyPokemon = gameState1.ennemyTeam.pokemons[pokemonName];
        console.log(moveName,move[2])
        let moveInfo = enemyPokemon.moves[moveName];
        const dexInfo = Dex.moves.get(moveName);
        if (moveInfo === undefined) {
            moveInfo ??= {
                "pp": dexInfo.pp *1.6,
                "basePower":dexInfo.basePower,
                "accuracy":dexInfo.accuracy,
                "category":dexInfo.category,
                "priority":dexInfo.priority,
                "flags":dexInfo.flags,
                "type": dexInfo.type,
                "status":dexInfo.status,
                "secondary":dexInfo.secondary
            };
        } else {

            if (gameState2.yourTeam.active.ability == 'Pressure' || gameState1.yourTeam.active.ability == 'Pressure'){
                moveInfo.pp -= 2;
            } else {
                moveInfo.pp -= 1;
            }

        }
        gameState1.ennemyTeam.pokemons[pokemonName].moves[moveName] = moveInfo;
        gameState1.ennemyTeam.lastMove = gameState2.yourTeam.lastMove = {
            "pokemon":pokemonName,
            "target":move[5].slice(1),
            "moveName":moveName
        };
    }

    updateLastMove(gameState1,gameState2,move){
        const moveName = move[3];
        const pokemonName = Object.keys(gameState1.ennemyTeam.pokemons)
            .find(key => key.includes(move[2].slice(1)));
        gameState1.ennemyTeam.lastMove = gameState2.yourTeam.lastMove = {
            "pokemon":pokemonName,
            "target":move[5].slice(1),
            "moveName":moveName
        };
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

    updateVolatileStatus(gameState1,gameState2,volatileStatus,hasEnded){
        const pokemonName = Object.keys(gameState1.ennemyTeam.pokemons)
            .find(key => key.includes(volatileStatus[2].slice(1)));

        let statusType = ((volatileStatus[3]==="move" || volatileStatus[3]==="ability") ? volatileStatus[4].slice(1) : volatileStatus[3]);
        if(hasEnded){
            if(statusType==="Quark Drive" || statusType==="Protosynthesis"){
                gameState1.ennemyTeam.pokemons[pokemonName].abilities = {'0':"None"};
            }else{
                gameState1.ennemyTeam.pokemons[pokemonName].volatileStatus = gameState1.ennemyTeam.pokemons[pokemonName].volatileStatus.filter(status => status !== statusType);
                gameState2.yourTeam.pokemons[pokemonName].volatileStatus = gameState2.yourTeam.pokemons[pokemonName].volatileStatus.filter(status => status !== statusType);


            }
        }else{
            gameState1.ennemyTeam.pokemons[pokemonName].volatileStatus.push(statusType);
            gameState2.yourTeam.pokemons[pokemonName].volatileStatus.push(statusType);
        }


    }

    updateStats(gameState,boost,isBoost){
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

    invertBoost(gameState,invertboost){
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

    swapBoost(gameState1,gameState2,swapboost){
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

    clearBoost(gameState,clearboost){
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

    clearAllBoost(gameState1,gameState2){
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

    clearPositiveBoost(gameState,clearpositiveboost){
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(clearpositiveboost[2].slice(1)));
        const pokemon = gameState.ennemyTeam.pokemons[pokemonName];
        Object.keys(pokemon.statsModifiers).forEach(stat => {
            pokemon.statsModifiers[stat].boost = 0;
            pokemon.statsAfterBoost[stat] = Math.floor(pokemon.estimatedStats[stat] * 2/(pokemon.statsModifiers[stat].unboost + 2));
        });
    }

    clearNegativeBoost(gameState,clearnegativeboost){
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(clearnegativeboost[2].slice(1)));
        const pokemon = gameState.ennemyTeam.pokemons[pokemonName];
        Object.keys(pokemon.statsModifiers).forEach(stat => {
            pokemon.statsModifiers[stat].unboost = 0;
            pokemon.statsAfterBoost[stat] = Math.floor(pokemon.estimatedStats[stat] * (pokemon.statsModifiers[stat].boost+2)/2);
        });
    }

    copyBoost(gameState1,gameState2,copyboost){
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

    estimateOffense(gameState,damage,lastMove,attackingStatsModifiers){
        if(Object.keys(lastMove).length != 0 && lastMove.target!="still]" && lastMove.pokemon!=undefined){
            const defendingPokemonName = Object.keys(gameState.yourTeam.pokemons)
                .find(key => key.includes(lastMove.target));
            const attackingPokemonName = Object.keys(gameState.ennemyTeam.pokemons)
                .find(key => key.includes(lastMove.pokemon));
            const defendingPokemon = gameState.yourTeam.pokemons[defendingPokemonName];
            const attackingPokemon = gameState.ennemyTeam.pokemons[attackingPokemonName];

            let lostHP = parseInt(damage[3].split('/')[0]);
            console.log("last dmg fusi : ",damage);
            console.log("last move fusi : ",lastMove);
            console.log("last atk fusi : ",attackingPokemon);
            console.log("last def fusi : ",defendingPokemon);
            const maxHP = parseInt(defendingPokemon.condition.split(/[/:]/)[1])
            lostHP = maxHP - Math.floor(lostHP * maxHP/100);
            const moveInfo = Dex.moves.get(lastMove.moveName);
            const bp = this.getBasePower(moveInfo,defendingPokemon,gameState,attackingPokemon,attackingStatsModifiers);
            const lv = parseInt(attackingPokemon.lv);
            const def = this.getDefStatToUse(moveInfo,defendingPokemon,attackingStatsModifiers)[0];
            let off = (moveInfo.category === 'Physical' ? (moveInfo.name === 'Body Press' ? 'def' : 'atk') : 'spa');
            if (lastMove.moveName === "Photon Geyser" && attackingPokemon.stats['atk'] > attackingPokemon.stats['spa']) {
                off = 'atk';
            }

            const stab = (attackingPokemon.types.includes(moveInfo.type) ? 1.5 : 1);
            const weather = this.getWeatherMultiplier(moveInfo.type,gameState.weather,lastMove.name);
            const burn = ((moveInfo.category=='Physical' && attackingPokemon.status =="brn" && attackingPokemon.ability!="Guts") ? 0.5 : 1);
            const type = this.getTypeMultiplier(moveInfo.type,defendingPokemon.types,lastMove.moveName,defendingPokemon.ability,defendingPokemon.volatileStatus,defendingPokemon.item,);
            const other = this.getOtherMultipliers(lastMove.moveName,gameState.ground,type,defendingPokemon.ability,attackingPokemon.abilities['0'],attackingPokemon.item,defendingPokemon.currentHP,defendingPokemon.volatileStatus);

            const estimatedOffense = this.findOffense(lostHP,lv,def,bp,1,weather,1,1,stab,type,burn,other);
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

    estimateDefense(gameState,damage,lastMove,attackingStatsModifiers){

        if(Object.keys(lastMove).length != 0 && lastMove.target!="still]" && lastMove.pokemon!=undefined){
            const defendingPokemonName = Object.keys(gameState.ennemyTeam.pokemons)
                .find(key => key.includes(lastMove.target));
            const attackingPokemonName = Object.keys(gameState.yourTeam.pokemons)
                .find(key => key.includes(lastMove.pokemon));
            const defendingPokemon = gameState.ennemyTeam.pokemons[defendingPokemonName];
            const attackingPokemon = gameState.yourTeam.pokemons[attackingPokemonName];
            console.log("last dmg fusd : ",damage);
            console.log("last move fusd : ",lastMove);
            console.log("last atk fusd : ",attackingPokemon);
            console.log("last def fusd : ",defendingPokemon);
            let lostHP = parseInt(damage[3].split('/')[0]);
            const lv = parseInt(attackingPokemon.lv);
            const baseHP = Dex.species.get(defendingPokemonName).baseStats.hp;
            const estimatedMaxHP = this.getHp(baseHP,31,0,lv);
            const estimatedMaxHPMaxInv = this.getHp(baseHP,31,252,lv);
            const lostHPMaxInv = estimatedMaxHPMaxInv - Math.floor(lostHP * estimatedMaxHPMaxInv/100);
            lostHP = estimatedMaxHP - Math.floor(lostHP * estimatedMaxHP/100);

            const moveInfo = Dex.moves.get(lastMove.moveName);
            const bp = this.getBasePower(moveInfo,defendingPokemon,gameState,attackingPokemon,attackingStatsModifiers);
            const def = this.getDefStatToUse(moveInfo,defendingPokemon,attackingStatsModifiers)[1];
            let off = (moveInfo.category === 'Physical' ? (moveInfo.name === 'Body Press' ? attackingPokemon.stats['def'] : attackingPokemon.stats['atk']) : attackingPokemon.stats['spa']);
            if(lastMove.moveName ==="Photon Geyser" && attackingPokemon.stats['atk'] > attackingPokemon.stats['spa']){
                off = attackingPokemon.stats['atk'];
            }
            const stab = (attackingPokemon.types.includes(moveInfo.type) ? 1.5 : 1);
            const weather = this.getWeatherMultiplier(moveInfo.type,gameState.weather,lastMove.name);
            const burn = ((moveInfo.category=='Physical' && attackingPokemon.condition.includes("brn") && attackingPokemon.ability!="Guts") ? 0.5 : 1);
            const type = this.getTypeMultiplier(moveInfo.type,defendingPokemon.types,lastMove.moveName,defendingPokemon.abilities,defendingPokemon.volatileStatus,defendingPokemon.item);
            const other = this.getOtherMultipliers(lastMove.moveName,gameState.ground,type,defendingPokemon.abilities['0'],attackingPokemon.ability,attackingPokemon.item,defendingPokemon.currentHP,defendingPokemon.volatileStatus);
            const estimatedDefense = this.findDefense(lostHP,lv,off,bp,1,weather,1,1,stab,type,burn,other)
            const estimatedDefenseMaxInv = this.findDefense(lostHPMaxInv,lv,off,bp,1,weather,1,1,stab,type,burn,other);
            const state = (gameState == this.gameStateP1 ? this.gameStateP2 : this.gameStateP1)

            if(attackingPokemon.statsModifiers!=undefined){
                if(attackingPokemon.statsModifiers[off]!=undefined){
                    for(let estimate in estimatedDefense){
                        estimate = Math.floor(2*estimate/(attackingPokemon.statsModifiers[def].boost+2));
                        estimate = Math.floor(estimate*(attackingPokemon.statsModifiers[def].unboost+2)*2);
                    }
                }
            }

            gameState.ennemyTeam.pokemons[defendingPokemonName].estimatedStats[def] = Math.floor((estimatedDefense.min+estimatedDefense.max)/2);

        }
    }

    updateItem(gameState,item,endItem){
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(item[2].slice(1)));
        gameState.ennemyTeam.pokemons[pokemonName].item = (endItem ? "None" : item[3]);
    }

    updateRevealedItem(gameState,revealedItem){
        const item = revealedItem[revealedItem.length-1].slice(1);
        if(!item.includes('Berry')){
            const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
                .find(key => key.includes(revealedItem[2].slice(1)));
            const pokemon = gameState.ennemyTeam.pokemons[pokemonName];
            pokemon.item = item;
        }
    }

    updateHP(gameState,damage){
        const hp = damage[3].split('/');
        const currentHp = parseInt(hp[0]);
        const pokemonName = Object.keys(gameState.ennemyTeam.pokemons)
            .find(key => key.includes(damage[2].slice(1)));
        console.log(damage)
        console.log(pokemonName)
        gameState.ennemyTeam.pokemons[pokemonName].currentHP = currentHp;
        if(hp.includes("fnt")){
            gameState.ennemyTeam.pokemons[pokemonName] = "fnt";
        }
    }

    endIllusion(gameState,replace){
        const illusion = gameState.ennemyTeam.active;
        const newFormDetails = replace[3].split(',');
        const dexDetails = Dex.species.get(newFormDetails[0]);
        if(!gameState.ennemyTeam.pokemons.hasOwnProperty(newFormDetails[0])){
            gameState.ennemyTeam.pokemons[newFormDetails[0]] = {
                "lv":newFormDetails[1].slice(2),
                "types":dexDetails.types,
                "abilities":dexDetails.abilities,
                "estimatedStats":{...dexDetails.baseStats},
                "statsAfterBoost":{...dexDetails.baseStats},
                "statsModifiers":{...illusion.statsModifiers},
                "moves":{...illusion.moves},
                "currentHP":illusion.currentHP,
                "item":illusion.item,
                "status":illusion.status,
                "volatileStatus":[...illusion.volatileStatus]
            };
        }
        let newForm = {...gameState.ennemyTeam.pokemons[newFormDetails[0]]};
        Object.keys(newForm.statsModifiers).forEach(stat => {
            let res = Math.floor(newForm.estimatedStats[stat] * (newForm.statsModifiers[stat].boost+2)/2);
            newForm.statsAfterBoost[stat] = Math.floor(res * 2/(newForm.statsModifiers[stat].unboost + 2));
        });
        delete gameState.ennemyTeam.pokemons[illusion.name];
        gameState.ennemyTeam.active = newForm;
        gameState.ennemyTeam.active.name = newFormDetails[0];

    }

    activateTransform(gameState1,gameState2){
        //If active pokemon is Metamorph
        const activeEnnemyPokemon = gameState2.yourTeam.active;
        let metamorph = gameState2.ennemyTeam.pokemons[gameState1.yourTeam.active.name];
        metamorph.types = [...activeEnnemyPokemon.types];
        metamorph.abilities = {'0':activeEnnemyPokemon.ability};
        metamorph.estimatedStats = {...Dex.species.get(activeEnnemyPokemon.name).baseStats};
        metamorph.statsAfterBoost = {...activeEnnemyPokemon.stats};
        metamorph.statsModifiers = {...gameState1.ennemyTeam.pokemons[activeEnnemyPokemon.name].statsModifiers};
        metamorph.moves = {...activeEnnemyPokemon.moves};
    }

    getStat(baseStat,iv,ev,level,nature){
        return (Math.floor(0.01 *(2 * baseStat + iv + Math.floor(0.25 * ev))*level) + 5) * nature
    }

    getHp(baseHP,iv,ev,level){
        return Math.floor(0.01 * (2 * baseHP + iv + Math.floor(0.25 * ev)) * level) + level + 10
    }

    getDefStatToUse(move,target,statsModifiers){
        const statsAfterBoost = target.statsAfterBoost || target.stats;
        const defStat = statsAfterBoost['def'];
        const spdStat = statsAfterBoost['spd'];
        let statToUse = (move.category === 'Physical' ?  defStat : spdStat );
        let statKey = (move.category === 'Physical' ?  'def' : 'spd' )
        if(move.name==="Shell Side Arm"){
            statToUse = (defStat >= spdStat ? spdStat : defStat );
            statKey = (defStat >= spdStat ? 'spd' : 'def' );
        }else if(move.name==="Psyshock" || move.name==="Psystrike" || move.name==="Secret Sword"){
            statToUse = defStat;
            statKey = 'def';
        }else if(move.name==="Sacred Sword"){
            statKey = 'def';
            if(target.estimatedStats!=undefined){
                statToUse = target.estimatedStats['def'];
            }else{
                statToUse = statsAfterBoost['def'] * 2/(statsModifiers['def'].boost + 2);
            }
        }
        return [statToUse,statKey]
    }

    getBasePower(move,target,gameState,pokemon,statsModifiers){
        let bp = move.basePower;
        if(move.name==="Hard Press"){
            bp = target.currentHP;
        }else if(move.name==="Rage Fist"){
            bp = 50; //Add number of previous hit
        }else if(move.name==="Psyblade" && gameState.ground.field["move: Electric Terrain"]){
            bp = 120;
        }else if(move.name==="Last Respects"){
            const keys = Object.keys(gameState.yourTeam.pokemons);
            let faintedPokemons = 0;
            for (let i = 0; i < keys.length; i++) {
                const pokemon = gameState.yourTeam.pokemons[keys[i]];
                if (pokemon.condition.includes('fnt')) {
                    faintedPokemons++;
                }
            }
            bp = 50 + 50 * faintedPokemons;
        }else if(target.status!="None" && (move.name==="Infernal Parade" || move.name==="Hex")){
            bp *= 2;
        }else if(target.status.includes("psn") && move.name==="Barb Barage"){
            bp *= 2;
        }else if(move.name==="Dragon Energy" || move.name==="Eruption" || move.name==="Water Spout"){
            const pokemonCondition = ( pokemon.conditon!==undefined ? pokemon.condition.split(/[/ ]/).filter(condition => condition) : [pokemon.currentHP,100]);
            bp = Math.floor(150 * pokemonCondition[0]/pokemonCondition[1]);
            bp = (bp < 1 ? 1 : bp);
        }else if(move.name==="Rising Voltage" && gameState.ground.field["move: Electric Terrain"]){
            bp *= 2;
        }else if(move.name==="Misty Explosion" && gameState.ground.field["move: Misty Terrain"]){
            bp *= 1.5;
        }else if(move.name==="Expanding Force" && gameState.ground.field["move: Psychic Terrain"]){
            bp *= 1.5;
        }else if(move.name==="Grav Apple" && gameState.ground.field["move: Gravity"]){
            bp *=1.5;
        }else if(move.name==="Dream Eater" && target.status!="slp"){
            bp = 0;
        }else if(move.name==="Snore" && pokemon.status!="slp"){
            bp = 0;
        }else if(move.name==="Flail" || move.name==="Reversal"){
            const pokemonCondition = ( pokemon.conditon!==undefined ? pokemon.condition.split(/[/ ]/).filter(condition => condition) : [pokemon.currentHP]);
            const currentHP = pokemonCondition[0];
            bp = currentHP >= 69 ? 20 :
                currentHP >= 36 ? 40 :
                    currentHP >= 21 ? 80 :
                        currentHP >= 11 ? 100 :
                            currentHP >= 5  ? 150 : 200;
        }else if(move.name==="Return" || move.name==="Frustration"){
            bp = 102;
        }else if(move.name==="Magnitude"){
            bp = 70;
        }else if(move.name==="Facade" && /(brn|par|psn)/.test(pokemon.condition)){
            bp *= 2;
        }else if(move.name==="Weather Ball" && gameState.weather!="None"){
            bp *= 2;
        }else if(move.name==="Gyro Ball"){
            bp = Math.min(150,25 * pokemon.stats['spe']/target.statsAfterBoost['spe'] + 1);
        }else if(move.name==="Brine"){
            bp = (target.currentHP < 50 ? 130 : bp);
        }else if(move.name==="Crush Grip"){
            bp = Math.floor(120 * target.currentHP/100);
            bp = (bp < 1 ? 1 : bp);
        }else if(move.name==="Venoshock" && target.status==="psn"){
            bp *= 2;
        }else if(move.name==="Store Power" || move.name==="Power Trip"){
            let boosts = 0;
            Object.keys(statsModifiers).forEach(stat => {
                boosts += stat.boost;
            });
            bp = 20 + 20* boost;
        }else if(move.name==="Acrobatics" && pokemon.item==="None"){
            bp *= 2;
        }else if(move.name==="Poltergeist" && target.item==="None"){
            bp = 0;
        }
        return bp
    }

    getPossibleDamage(gameState,attackingStatsModifiers){
        const pokemon = gameState.yourTeam.active;
        const target = gameState.ennemyTeam.active;
        gameState.damageCalc.pokemon = pokemon.name;
        gameState.damageCalc.target = target.name;
        if(Object.keys(target).length!=0 && Object.keys(pokemon).length!=0){

            pokemon.moves.forEach(move => {
                const bp = this.getBasePower(move,target,gameState,pokemon,attackingStatsModifiers);
                if(bp!=0){
                    const dexInfos = Dex.species.get(target.name);
                    const lv = parseInt(pokemon.lv);
                    let off = (move.category === 'Physical' ? (move.name === 'Body Press' ? pokemon.stats['def'] : pokemon.stats['atk']) : pokemon.stats['spa']);
                    if(move.name ==="Photon Geyser" && pokemon.stats['atk'] > pokemon.stats['spa']){
                        off = pokemon.stats['atk'];
                    }
                    const def = this.getDefStatToUse(move,target,attackingStatsModifiers)[0];

                    const stab = (pokemon.types.includes(move.type) ? 1.5 : 1);
                    const weather = this.getWeatherMultiplier(move.type,gameState.weather,move.name);
                    const burn = ((move.category==='Physical' && pokemon.condition.includes("brn") && pokemon.ability!="Guts") ? 0.5 : 1);
                    const type = this.getTypeMultiplier(move.type,target.types,move.name,target.abilities,target.volatileStatus,target.item);
                    const other = this.getOtherMultipliers(move.name,gameState.ground,type,target.abilities['0'],pokemon.ability,pokemon.item,target.currentHP,target.volatileStatus);
                    gameState.damageCalc.minInv[move.name] = this.calculateDamage(lv, off, this.getStat(def,31,0,parseInt(target.lv),1), bp, 1, weather, 1, 1, stab, type, burn, other)
                        .map(dmg => Math.floor(100 * (dmg/this.getHp(dexInfos.baseStats['hp'],31,0,parseInt(target.lv)))));

                    gameState.damageCalc.maxInv[move.name] = this.calculateDamage(lv, off, this.getStat(def,31,252,target.lv,1), bp, 1, weather, 1, 1, stab, type, burn, other)
                        .map(dmg => Math.floor(100 * (dmg/this.getHp(dexInfos.baseStats['hp'],31,252,parseInt(target.lv)))));
                }
                if(move.name ==="Night Shade" || move.name==="Seismic Toss"){
                    gameState.damageCalc.minInv[move.name] = parseInt(pokemon.lv);
                    gameState.damageCalc.maxInv[move.name] = parseInt(pokemon.lv);
                }
            });
        }
    }

    getOtherMultipliers(move,ground,typeMultiplier,targetAbility,pokemonAbility,item,targetCurrentHP,targetVolatileStatus){
        const moveInfo = Dex.moves.get(move);
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
        if(moveInfo.category=="Special" && (ground.hazards["Light Screen"] || ground.hazards["Aurora Veil"])){
            res *= 0.5;
        }
        if(moveInfo.category=="Physical" && (ground.hazards["Reflect"] || ground.hazards["Aurora Veil"])){
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
        if(pokemonAbility=="Refrigerate" && move.type=="Ice"){
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
        if(pokemonAbility==="Sharpness" && moveInfo.flags.hasOwnProperty("slicing")){
            res *= 1.5;
        }
        if(pokemonAbility=="Punk Rock" && moveInfo.flags.hasOwnProperty("sound")){
            res *= 1.3;
        }
        if(moveInfo.type=="Electric" && ground.field["Electric Terrain"]){
            res *= 1.3;
        }
        if(moveInfo.type=="Grass" && ground.field["Grassy Terrain"]){
            res *= 1.3;
        }
        if(moveInfo.type=="Psychic" && ground.field["Psychic Terrain"]){
            res *= 1.3;
        }
        if(moveInfo.type=="Dragon" && ground.field["Misty Terrain"]){
            res *= 0.5;
        }
        if(ground.field["Grassy Terrain"] && (move=="Earthquake" || move=="Bulldoze" || move=="Magnitude")){
            res *= 0.5;
        }
        return res
    }

    getWeatherMultiplier(type,weather,moveName){
        let multiplier = 1;
        if(weather==="SunnyDay"){
            if(type==="Fire"){
                multiplier = 1.5;
            }else if(type==="Water"){
                multiplier = 0.5;
            }
            if(moveName==="Hydro Steam"){
                multiplier = 1.5;
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

    getTypeMultiplier(moveType,targetTypes,moveName,targetAbility,targetVolatileStatus, targetItem){
        let res = 1;
        let immune = 1;
        const itemName = targetItem.toLowerCase().replace(/\s/g, '');
        if(moveName==="Flying Press"){
            res = this.flyingPress(targetTypes);
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
                if((targetAbility==="Storm Drain" || targetAbility==="Dry Skin" || targetAbility==="Water Absorb") && moveType==="Water"){
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

    flyingPress(targetTypes){
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

    detailschange(gameState1,gameState2,change){
        console.log("CHANNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        console.log("ancient GS1 : " , JSON.stringify(gameState1))
        console.log("ancient GS2 : " ,JSON.stringify(gameState2))
        const ancientForm = Object.keys(gameState1.yourTeam.pokemons)
            .find(key => key.includes(change[2].slice(1)));
        const newForm = change[3].split(',')[0];
        console.log("form 1: ",ancientForm)
        console.log("forminfo 1: ",gameState1.yourTeam.pokemons)
        console.log("form 2: ",newForm)
        console.log("forminfo 1: ",gameState2.ennemyTeam.pokemons)
        if (gameState1.yourTeam.pokemons.hasOwnProperty(ancientForm)){
            delete gameState1.yourTeam.pokemons[ancientForm];
        }
        if (gameState2.ennemyTeam.pokemons.hasOwnProperty(ancientForm)){
            gameState2.ennemyTeam.pokemons[newForm] = JSON.parse(JSON.stringify(gameState2.ennemyTeam.pokemons[ancientForm]));
            gameState2.ennemyTeam.pokemons[newForm].name = newForm;
            delete gameState2.ennemyTeam.pokemons[ancientForm];
        }


        console.log("newForm 2: ",newForm)
        console.log("newForminfo 2: ",gameState2.ennemyTeam.pokemons)
        console.log("_______________________________________________________________")

        console.log("new GS1 : " ,JSON.stringify(gameState1))
        console.log("new GS2 : " ,JSON.stringify(gameState2))
        console.log("CHANNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")

    }

    findAbilityAndPokemon(log) {
        const abilityRegex = /ability|\S+ability/;

        for (const entry of log) {
            const abilityMatch = entry.match(abilityRegex);
            if (abilityMatch) {
                let pokemonMatch;
                if (entry.includes("[of]")){
                    const pokemonRegex = /of] ([p1p2]+)a: ([a-zA-Z0-9_ -]+)/;
                    pokemonMatch = entry.match(pokemonRegex);
                } else {
                    const pokemonRegex = /([p1p2]+)a: ([a-zA-Z0-9_ -]+)/;
                    pokemonMatch = entry.match(pokemonRegex);
                }

                if (pokemonMatch) {
                    const player = pokemonMatch[1];
                    const pokemon = pokemonMatch[2];
                    if (player==='p2'){
                        let datap2;
                        let ability;
                        datap2 = this.gameStateP2.yourTeam.pokemons;
                        for (const [pokemonName, pokemonInfo] of Object.entries(datap2) ){
                            if (pokemonName.includes(pokemon)){
                                ability = pokemonInfo.ability;
                            }
                        }
                        console.log("teamadverse p1 : ",this.gameStateP1.ennemyTeam.pokemons)
                        console.log("team p2 : ",this.gameStateP2.yourTeam.pokemons)
                        console.log("pour : ", pokemon);
                        const pokemonName = Object.keys(this.gameStateP1.ennemyTeam.pokemons)
                            .find(key => key.includes(pokemon));
                        this.gameStateP1.ennemyTeam.pokemons[pokemonName].abilities = {'0':ability};
                        this.gameStateP1.ennemyTeam.active.abilities = {'0':ability};
                    }
                    if (player==='p1'){
                        let datap1;
                        let ability;
                        datap1 = this.gameStateP1.yourTeam.pokemons;
                        for (const [pokemonName, pokemonInfo] of Object.entries(datap1) ){
                            if (pokemonName.includes(pokemon)){
                                ability = pokemonInfo.ability;
                            }
                        }
                        console.log("teamadverse p2 : ",this.gameStateP2.ennemyTeam.pokemons)
                        console.log("team p1 : ",this.gameStateP1.yourTeam.pokemons)
                        console.log("pour : ", pokemon);
                        const pokemonName = Object.keys(this.gameStateP2.ennemyTeam.pokemons)
                            .find(key => key.includes(pokemon));
                        this.gameStateP2.ennemyTeam.pokemons[pokemonName].abilities = {'0':ability};
                        this.gameStateP2.ennemyTeam.active.abilities = {'0':ability};
                    }
                }
            }
        }
    }

    possibilitiesMoves(gameState,typeTurn) {

        let possibilities={"move":[],"switch":[]};
        if (typeTurn=="end"){return possibilities}
        if (typeTurn!="switch" && typeTurn!="revival"){
            gameState.yourTeam.active.moves.forEach(move => {

                if ((move.disabled==false && move.pp>0)){
                    possibilities.move.push(move.name);
                }
            });
            if(gameState.yourTeam.active.moves.length==1){
                possibilities.move.push(gameState.yourTeam.active.moves[0].name);
            }

        }
        if (gameState.yourTeam.lastMove.moveName=='Revival Blessing' && typeTurn=="revival"){
            Object.entries(gameState.yourTeam.pokemons).forEach(([_pokemonName, pkmn]) =>{
                if (pkmn.condition.includes('fnt')){
                    possibilities.switch.push(pkmn.name);
                }
            });
        } else {
            if (gameState.yourTeam.active.isTrapped!=true){

                Object.entries(gameState.yourTeam.pokemons).forEach(([_pokemonName, pkmn]) =>{
                    if (!pkmn.condition.includes('fnt') && pkmn.name!==gameState.yourTeam.active.name){
                        possibilities.switch.push(pkmn.name);
                    }
                });
            }


        }

        return possibilities
    }

    updateChargedMove(gameState1,gameState2,move){
        const moveName = move[4].slice(1);
        const targetName = gameState1.ennemyTeam.active.name;
        const pokemonName = Object.keys(gameState1.yourTeam.pokemons).find(pokemonName => {
            const pokemon = gameState1.yourTeam.pokemons[pokemonName];
            return pokemon.moves.some(move => move.name === moveName);
        });

        gameState1.yourTeam.lastMove = gameState2.ennemyTeam.lastMove = {
            "pokemon":pokemonName,
            "target":targetName,
            "moveName":moveName
        };
    }
}


module.exports = { Game };