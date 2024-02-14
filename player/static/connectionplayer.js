let turn=0;
let activep1;
let activep2;
// Function to handle sending messages in a loop
async function sendMessages(socket) {

    while (true) {
        
        // Wait for a response from the server
        data1 = await new Promise(resolve => {
            socket.onmessage = function(event) {

                resolve(JSON.parse(event.data));
            };
        });

        // Wait for a response from the server
        data2 = await new Promise(resolve => {
            socket.onmessage = function(event) {
                resolve(JSON.parse(event.data));
            };
        });

        if (data1['player']!="p1"){
            tmp=data1;
            data1=data2;
            data2=tmp;
        }


        updateActivePokemon(data1.gameState.yourTeam.active,data1.gameState.ennemyTeam.active);
        updateEnnemyTeam(data1.gameState.ennemyTeam.pokemons);

        if(data1['typeturn']==="play"){
            turn+=1;
        }
        console.log(turn);
        
        moves=[];
        console.log(data1['gameState']['yourTeam']['active']['moves']);
        console.log(data1.gameState)
        console.log(data2.gameState)
        deleteButtons('.play-buttons');
        createButtons(data1['gameState']['yourTeam']['active']['moves'],"move",data1['possibilities']);
        deleteButtons('.your-team');
        createButtons(data1['gameState']['yourTeam']['pokemons'],"switch",data1['possibilities'])
        if (activep1!=data1['gameState']['yourTeam']['active']['name']){
            activep1=data1['gameState']['yourTeam']['active']['name']
        }
        if (data1['typeturn']!="wait" && data1['typeturn']!="end"){
            moves.push(await main());
        }

        if (data2['typeturn']!="wait" && data2['typeturn']!="end"){
            const response2 = await fetch('/playIa', {
                method: 'POST', // or 'GET' depending on your Flask route
                headers: {
                    'Content-Type': 'application/json'
                },
                // You can pass data if needed
                body: JSON.stringify({data2})
            });
            moves.push((await response2.json())['move']);
        }

        //Moves dispo

        if (data2['typeturn']=="end"){
            console.log(data1['gameState']['battleState'])
            socket.onclose= function (event) {
                console.log('WebSocket connection closed');
                document.getElementById('connectButton').style.display = 'block';
                // You can handle the WebSocket closing event here
            };
            break;
        }
        socket.send(JSON.stringify({"game_id":data1['game_id'],"moves":moves}));
    }

}
async function main() {
    try {
        console.log("Waiting for player's click on buttons...");

        // Wait for either "selectmove" or "selectswitch" button click
        const firstButtonClick = await Promise.race([
            waitForButtonClick('selectmove'),
            waitForButtonClick('selectSwitch')
        ]);

        if (firstButtonClick['move']){
            return ">p1 move " + firstButtonClick['move']
        } else {
            return ">p1 switch " + firstButtonClick['switch']
        }

        // Do something with the selected move or switch
    } catch (error) {
        console.error('Error:', error);
    }
}
function waitForButtonClick(className) {
    return new Promise((resolve, reject) => {
        // Get all buttons with the specified class name
        const buttons = document.querySelectorAll('.' + className);

        // Function to handle button click event
        function handleClick(event) {
            // Remove the event listener to prevent multiple resolves
            buttons.forEach(button => {
                button.removeEventListener('click', handleClick);
            });
            console.log("Player selected:", event.target);
            // Resolve the promise with the desired value (e.g., button text content)
            resolve({
                move: event.target.getAttribute('data-move'),
                switch: event.target.getAttribute('data-switch'),
            });
        }

        // Add event listener to buttons
        buttons.forEach(button => {
            button.addEventListener('click', handleClick);
        });
    });
}

function createButtons(namesArray, onClickFunction,possible) {
    if (onClickFunction=="move"){

        const playButtonsDiv = document.querySelector('.play-buttons');

        // Loop through the array and create buttons
        namesArray.forEach(move => {
            name=move['name']

            const button = document.createElement('button');

            // Add classes and attributes to the button
            button.setAttribute('name', 'chooseMove');
            button.setAttribute('data-move', name);
            button.classList.add('selectmove');

            // Create text nodes for the move name, type, and pp
            const moveTextNode = document.createTextNode(name);
            const typeTextNode = document.createTextNode(move['type']);
            const ppTextNode = document.createTextNode(move['pp']);

            // Create small elements for move type and pp
            const typeSmall = document.createElement('small');
            const ppSmall = document.createElement('small');

            // Add classes to the small elements
            typeSmall.classList.add('type');
            ppSmall.classList.add('pp');
            typeSmall.setAttribute('data-move', name);
            ppSmall.setAttribute('data-move', name);
            // Append text nodes to the small elements
            typeSmall.appendChild(typeTextNode);
            ppSmall.appendChild(ppTextNode);

            // Append child elements to the button
            button.appendChild(moveTextNode);
            button.appendChild(document.createElement('br')); // Line break
            button.appendChild(typeSmall);
            button.appendChild(document.createTextNode(' ')); // Space
            button.appendChild(ppSmall);
            // Append the button to the play-buttons div
            if (!possible['move'].includes(name)) {
                button.setAttribute('disabled', true);
            }
            playButtonsDiv.appendChild(button);
        });
    } else {
        // Get the play-buttons div
        const teamButtonsDiv = document.querySelector('.your-team');
        console.log(namesArray)
        // Loop through the array and create buttons
        for (const pokemonName in namesArray) {
            if (Object.hasOwnProperty.call(namesArray, pokemonName)) {
                pkmn=namesArray[pokemonName]
                // Create the button element
                const button = document.createElement('button');

                // Add classes and attributes to the button
                button.setAttribute('name', 'chooseSwitch');
                button.setAttribute('data-switch', pokemonName);

                button.classList.add('selectSwitch');

                // Create the span element for the picon
                const piconSpan = document.createElement('span');
                piconSpan.classList.add('picon');
                piconSpan.style.background = 'transparent url(https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png?v16) no-repeat scroll -360px -570px';

                // Create text node for the Pokemon name
                const nameTextNode = document.createTextNode(pokemonName);

                // Create the span element for the hpbar
                const hpBarSpan = document.createElement('span');
                hpBarSpan.classList.add('hpbar');

                // Create the span element for the hpbar width
                const hpWidthSpan = document.createElement('span');
                const str = pkmn['condition'];
                const [numerator, denominator] = str.split("/");
                const percentage = (parseFloat(numerator) / parseFloat(denominator)) * 100;

                hpWidthSpan.style.width = percentage+"%";
                console.log(pkmn['condition'])
                // Append child elements to the button
                button.appendChild(piconSpan);
                button.appendChild(nameTextNode);
                button.appendChild(hpBarSpan);
                hpBarSpan.appendChild(hpWidthSpan);

                if (!possible['switch'].includes(pokemonName)) {
                    button.setAttribute('disabled', true);
                }
                // Append the button to the play-buttons div
                teamButtonsDiv.appendChild(button);

            }
        }
    }

}

function deleteButtons(container) {
    // Get the play-buttons div
    const playButtonsDiv = document.querySelector(container);

    // Remove all child elements (buttons) from the div
    while (playButtonsDiv.firstChild) {
        playButtonsDiv.removeChild(playButtonsDiv.firstChild);
    }
}

document.getElementById('connectButton').addEventListener('click', async function () {
    // Replace 'ws://localhost:8080' with your WebSocket server URL
    const socket = new WebSocket('ws://localhost:8080');
    document.getElementById('connectButton').style.display = 'none';
    console.log('WebSocket connection opened');
    await sendMessages(socket);
});