import asyncio
import websockets

async def connect_to_websocket_server(player_number):
    uri = "ws://localhost:8080"  # Replace localhost:8080 with the appropriate server address
    async with websockets.connect(uri) as websocket:
        # Send a message to the server indicating player number
        await websocket.send(f"Player {player_number} connected from Python")

        while True:
            # Receive a message from the server
            response = await websocket.recv()
            print(f"Player {player_number} received: {response}")

            # Simulate player action or logic here if needed
            # For example:
            # await asyncio.sleep(1)  # Simulate some delay

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
        connect_to_websocket_server(31),
        connect_to_websocket_server(32),
        connect_to_websocket_server(33),
        connect_to_websocket_server(34),
        connect_to_websocket_server(41),
        connect_to_websocket_server(42),
        connect_to_websocket_server(43),
        connect_to_websocket_server(44),
        connect_to_websocket_server(51),
        connect_to_websocket_server(52),
        connect_to_websocket_server(53),
        connect_to_websocket_server(54),
        connect_to_websocket_server(61),
        connect_to_websocket_server(62),
        connect_to_websocket_server(63),
        connect_to_websocket_server(64),
        connect_to_websocket_server(71),
        connect_to_websocket_server(72),
        connect_to_websocket_server(73),
        connect_to_websocket_server(74),
    )

if __name__ == "__main__":
    asyncio.run(main())
