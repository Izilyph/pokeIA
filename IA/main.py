import asyncio
import websockets
import json


async def handle_turn(websocket, path):
    async for message in websocket:
        data = json.loads(message)
        print(f"Received turn data from client: {data}")

        # Process the turn data, simulate game logic
        # Example: Calculate damage, update game state, etc.

        # Send a response back to the client
        response = {
            'status': 'success',
            'message': '/move 1'
        }
        await websocket.send(json.dumps(response))
        print(f"Sent response to client: {response}")


start_server = websockets.serve(handle_turn, "localhost", 3000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()