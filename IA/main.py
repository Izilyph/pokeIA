import asyncio
import websockets
import random
import json

async def connect_to_websocket_server(player_number):
    uri = "ws://localhost:8080"  # Replace localhost:8080 with the appropriate server address
    async with websockets.connect(uri) as websocket:
        # Send a message to the server indicating player number
        
        rb=1
        ct=0
        while True:
            # Receive a message from the server
            response = await websocket.recv()
            json_data = json.loads(response)
            random_number=rb
            while random_number== rb :
                random_number = random.randint(1,6)
            
            rb = random_number

            ct=ct+1
            print(f"turn {ct} : Player {player_number} ")
async def main():
    await asyncio.gather(
        connect_to_websocket_server(1),
        connect_to_websocket_server(2),
    )

if __name__ == "__main__":
    asyncio.run(main())
