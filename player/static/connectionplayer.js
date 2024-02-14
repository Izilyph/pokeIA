let turn=0;
// Function to handle sending messages in a loop
async function sendMessages(socket) {

    while (true) {
        turn+=1;
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

        console.log('p1 msg: ',turn, " : ", data1);
        console.log('p2 msg: ',turn, " : ", data2['player']);
    }
}


document.getElementById('connectButton').addEventListener('click', async function () {
    // Replace 'ws://localhost:8080' with your WebSocket server URL
    const socket = new WebSocket('ws://localhost:8080');
    document.getElementById('connectButton').style.display = 'none';
    console.log('WebSocket connection opened');
    await sendMessages(socket);
    socket.onclose = function (event) {
        console.log('WebSocket connection closed');
        document.getElementById('connectButton').style.display = 'block';
        // You can handle the WebSocket closing event here
    };
});