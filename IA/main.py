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
            #print(json_data['gameState']['yourTeam']['active']['item'])
            if json_data['gameState']['battleState'] == "running":
                if not json_data['possibilities']['move']:
                    move = f"switch {json_data['possibilities']['switch'][0]}"
                else:
                    move = f"move {json_data['possibilities']['move'][0]}"
            if "Future Sight" in json_data['possibilities']['move']:
                move="move Future Sight"
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
    print(str(json_data['game_id'])+"  " + str(ct))

async def main():
    while True:
        await asyncio.gather(
            connect_to_websocket_server(1),
            connect_to_websocket_server(2),
        )


if __name__ == "__main__":
    asyncio.run(main())
