import asyncio
import websockets
import random
import json


async def connect_to_websocket_server(player_number):
    uri = "ws://localhost:8080"  # Replace localhost:8080 with the appropriate server address
    async with websockets.connect(uri) as websocket:
        # Send a message to the server indicating player number
        print(websocket)
        random_number = 2
        ct = 0
        while True:
            # your existing code here
            response1 = await websocket.recv()

            json_data1 = json.loads(response1)
            response2 = await websocket.recv()

            json_data2 = json.loads(response2)
            print(json_data1)
            print(json_data2)
            moves = []
            if json_data1['player'] != "p1":
                tmp = json_data1
                json_data1 = json_data2
                json_data2 = tmp

            if json_data1['typeturn'] != "wait" and json_data1['typeturn'] != "end":
                moves.append(f">p1 {random.choice(convert_actions(json_data1['possibilities']))}")
            if json_data2['typeturn'] != "wait" and json_data2['typeturn'] != "end":
                moves.append(f">p2 {random.choice(convert_actions(json_data2['possibilities']))}")
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

            connect_to_websocket_server(3),
            connect_to_websocket_server(4),
            connect_to_websocket_server(5),
            connect_to_websocket_server(6),
            connect_to_websocket_server(7),
            connect_to_websocket_server(8),
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
            connect_to_websocket_server(41),
            connect_to_websocket_server(42),
            connect_to_websocket_server(43),
            connect_to_websocket_server(44),
            connect_to_websocket_server(45),
            connect_to_websocket_server(46),
            connect_to_websocket_server(47),
            connect_to_websocket_server(48),
            connect_to_websocket_server(49),
            connect_to_websocket_server(50),
            connect_to_websocket_server(51),
            connect_to_websocket_server(52),
            connect_to_websocket_server(53),
            connect_to_websocket_server(54),
            connect_to_websocket_server(55),
            connect_to_websocket_server(56),
            connect_to_websocket_server(57),
            connect_to_websocket_server(58),
            connect_to_websocket_server(59),
            connect_to_websocket_server(60),
            connect_to_websocket_server(61),
            connect_to_websocket_server(62),
            connect_to_websocket_server(63),
            connect_to_websocket_server(64),
            connect_to_websocket_server(65),
            connect_to_websocket_server(66),
            connect_to_websocket_server(67),
            connect_to_websocket_server(68),
            connect_to_websocket_server(69),
            connect_to_websocket_server(70),
            connect_to_websocket_server(71),
            connect_to_websocket_server(72),
            connect_to_websocket_server(73),
            connect_to_websocket_server(74),
            connect_to_websocket_server(75),
            connect_to_websocket_server(76),
            connect_to_websocket_server(77),
            connect_to_websocket_server(78),
            connect_to_websocket_server(79),
            connect_to_websocket_server(80),
            connect_to_websocket_server(81),
            connect_to_websocket_server(82),
            connect_to_websocket_server(83),
            connect_to_websocket_server(84),
            connect_to_websocket_server(85),
            connect_to_websocket_server(86),
            connect_to_websocket_server(87),
            connect_to_websocket_server(88),
            connect_to_websocket_server(89),
            connect_to_websocket_server(90),
            connect_to_websocket_server(91),
            connect_to_websocket_server(92),
            connect_to_websocket_server(93),
            connect_to_websocket_server(94),
            connect_to_websocket_server(95),
            connect_to_websocket_server(96),
            connect_to_websocket_server(97),
            connect_to_websocket_server(98),
            connect_to_websocket_server(99),
            connect_to_websocket_server(100),
            
            """
