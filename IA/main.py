import asyncio
import websockets
import random
import json


async def connect_to_websocket_server(player_number):
    uri = "ws://localhost:8080"  # Replace localhost:8080 with the appropriate server address
    async with websockets.connect(uri) as websocket:
        # Send a message to the server indicating player number

        random_number = 2
        ct = 0
        while True:
            # your existing code here
            response = await websocket.recv()
            json_data = json.loads(response)
            #print(json_data['possibilities'])
            #print(json_data['gameState'])
            if json_data['gameState']['battleState'] == "running":
                if not json_data['possibilities']['move']:
                    move = f"switch {json_data['possibilities']['switch'][0]}"
                else:
                    move = f"move {json_data['possibilities']['move'][0]}"
            if "Future Sight" in json_data['possibilities']['move']:
                move = "move Future Sight"
            data = {
                "game_id": json_data['game_id'],
                "move": move
            }
            if json_data['gameState']['battleState'] == "running":
                await websocket.send(json.dumps(data))
            ct += 1
            #print(str(player_number) +" : " + str(ct)+ " " + json.dumps(data))
            #print("_______________________________________________________________________________")
            if json_data['gameState']['battleState'] != "running":
                break
    print(str(json_data['game_id']) + "  " + str(ct) + " " + str(player_number) + " : " + json_data['gameState']['battleState'])


async def main():
    while True:
        await asyncio.gather(
            connect_to_websocket_server(1),
            connect_to_websocket_server(2),
            connect_to_websocket_server(9),
            connect_to_websocket_server(10),
            connect_to_websocket_server(11),
            connect_to_websocket_server(12),
            connect_to_websocket_server(13),
            connect_to_websocket_server(14),
            connect_to_websocket_server(15),
            connect_to_websocket_server(16),
            connect_to_websocket_server(17),
            connect_to_websocket_server(18),
            connect_to_websocket_server(19),
            connect_to_websocket_server(20),
            connect_to_websocket_server(21),
            connect_to_websocket_server(22),
            connect_to_websocket_server(23),
            connect_to_websocket_server(24),
            connect_to_websocket_server(25),
            connect_to_websocket_server(26),
            connect_to_websocket_server(27),
            connect_to_websocket_server(28),
            connect_to_websocket_server(29),
            connect_to_websocket_server(30),
            connect_to_websocket_server(31),
            connect_to_websocket_server(32),
            connect_to_websocket_server(33),
            connect_to_websocket_server(34),
            connect_to_websocket_server(35),
            connect_to_websocket_server(36),
            connect_to_websocket_server(37),
            connect_to_websocket_server(38),
            connect_to_websocket_server(39),
            connect_to_websocket_server(40),
        )


if __name__ == "__main__":
    asyncio.run(main())

"""

            """
