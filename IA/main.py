import asyncio
import websockets
import random
import json


async def connect_to_websocket_server(player_number):
    uri = "ws://localhost:8080"  # Replace localhost:8080 with the appropriate server address
    async with websockets.connect(uri) as websocket:
        # Send a message to the server indicating player number
        #print(websocket)
        random_number = 2
        ct = 0
        while True:
            # your existing code here
            response1 = await websocket.recv()

            json_data1 = json.loads(response1)
            response2 = await websocket.recv()

            json_data2 = json.loads(response2)
            #print(json_data1)
            #print(json_data2)
            moves = []
            if json_data1['player'] != "p1":
                tmp = json_data1
                json_data1 = json_data2
                json_data2 = tmp

            if json_data1['typeturn'] != "wait" and json_data1['typeturn'] != "end":
                moves.append(f">p1 {random.choice(convert_actions(json_data1['possibilities']))}")
            if json_data2['typeturn'] != "wait" and json_data2['typeturn'] != "end":
                moves.append(f">p2 {random.choice(convert_actions(json_data2['possibilities']))}")
            #print(moves)
            if json_data1['typeturn'] != "end":
                ct += 1
                await websocket.send(json.dumps({
                    "game_id": json_data1['game_id'],
                    "moves": moves,
                }))
            else:
                print(str(json_data1['game_id']) + "  " + str(ct) + " " + json_data1['player'] + " : " +
                      json_data1['gameState']['battleState'])
                print(str(json_data2['game_id']) + "  " + str(ct) + " " + json_data2['player'] + " : " +
                      json_data2['gameState']['battleState'])
                break


def convert_actions(action_space):
    converted_actions = []
    for a in action_space["move"]:
        converted_actions.append("move " + a)
    for a in action_space["switch"]:
        converted_actions.append("switch " + a)
    return converted_actions


async def main():
    while True:
        await asyncio.gather(
            connect_to_websocket_server(1),
        )


if __name__ == "__main__":
    asyncio.run(main())

"""

            
            
            """
