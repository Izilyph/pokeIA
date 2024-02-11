import asyncio
import websockets
import random
import json


async def connect_to_websocket_server(player_number):
    uri = "ws://localhost:8080"  # Replace localhost:8080 with the appropriate server address
    async with websockets.connect(uri) as websocket:
        # Send a message to the server indicating player number

        random_number = 1
        ct = 0
        while ct<100:
            # Receive a message from the server
            response = await websocket.recv()
            json_data = json.loads(response)

            if random_number == 1:
                random_number = player_number +1
            else:
                random_number = 1
            await websocket.send(f"switch {random_number}")

            ct = ct + 1
            print(f"turn {ct} : Player {player_number} : switch {random_number}")



async def main():
    await asyncio.gather(
        connect_to_websocket_server(1),
        connect_to_websocket_server(2),
        connect_to_websocket_server(3),
        connect_to_websocket_server(4),
        connect_to_websocket_server(11),
        connect_to_websocket_server(12),
        connect_to_websocket_server(13),
        connect_to_websocket_server(14),
        connect_to_websocket_server(21),
        connect_to_websocket_server(22),
        connect_to_websocket_server(23),
        connect_to_websocket_server(24),
        connect_to_websocket_server(10),
        connect_to_websocket_server(20),
        connect_to_websocket_server(30),
        connect_to_websocket_server(40),
        connect_to_websocket_server(110),
        connect_to_websocket_server(120),
        connect_to_websocket_server(130),
        connect_to_websocket_server(140),
        connect_to_websocket_server(210),
        connect_to_websocket_server(220),
        connect_to_websocket_server(230),
        connect_to_websocket_server(240),
        connect_to_websocket_server(100),
        connect_to_websocket_server(200),
        connect_to_websocket_server(300),
        connect_to_websocket_server(400),
        connect_to_websocket_server(1100),
        connect_to_websocket_server(1200),
        connect_to_websocket_server(1300),
        connect_to_websocket_server(1400),
        connect_to_websocket_server(2100),
        connect_to_websocket_server(2200),
        connect_to_websocket_server(2300),
        connect_to_websocket_server(2400),
    )


if __name__ == "__main__":
    asyncio.run(main())
