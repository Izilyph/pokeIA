import gym
from gym import spaces
import numpy as np
import websockets
import json
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.optimizers import Adam
from rl.agents import DQNAgent
from rl.policy import BoltzmannQPolicy
from rl.memory import SequentialMemory
import asyncio
import random


class PokemonBattleEnv(gym.Env):
    def __init__(self):
        # Define action space and observation space
        self.action_space_p1 = spaces.Discrete(9)  # Assuming 4 actions: move1, move2, move3, move4, switch1, switch2, switch3, switch4, switch5
        self.observation_space_p1 = np.zeros((1,))
        self.action_space_p2 = spaces.Discrete(9)  # Assuming 4 actions: move1, move2, move3, move4, switch1, switch2, switch3, switch4, switch5
        self.observation_space_p2 = np.zeros((1,))
        self.reward_p1 = 0  # Reward for agent 1
        self.reward_p2 = 0  # Reward for agent 2
        self.done = False
        self.websocket = None
        self.gameID = None
        self.typerturn_p1 = ""
        self.typerturn_p2 = ""


    async def reset(self):
        # Reset the environment to its initial state and return the initial observation
        uri = "ws://localhost:8080"  # Replace localhost:8080 with the appropriate server address
        async with websockets.connect(uri) as websocket:
            self.websocket = websocket
            json_data1 = await get_data(websocket)
            json_data2 = await get_data(websocket)

            # Sort the data for each player
            if (json_data1["player"] != "p1"):
               tmp = json_data1
               json_data1 = json_data2
               json_data2 = tmp

            self.observation_space_p1 = [json_data1["gameState"]]
            self.observation_space_p2 = [json_data2["gameState"]]
            self.action_space_p1 = json_data1["possibilities"]
            self.action_space_p2 = json_data2["possibilities"]
            self.typerturn_p1 = json_data1["typeturn"]
            self.typerturn_p2 = json_data1["typeturn"]
            self.gameID = json_data2["game_id"]
            self.reward_p1 = 0
            self.reward_p2 = 0
            self.done = False

        return self.observation_space_p1, self.observation_space_p2

    async def step(self, action1, action2):
        # Take one step in the environment based on the given action
        # Return the new observation, reward, whether the episode is done, and additional information
        moves = []
        if (action1 != None and self.typerturn_p1 != "wait"):
            moves.append(">p1 "+ action1)
        
        if (action2 != None and self.typerturn_p2 != "wait"):
            moves.append(">p2 "+ action2)
        print (moves)
        data_sent = {
           "game_id": self.gameID,
           "moves": moves
        }
        print(data_sent)
        await self.websocket.send(json.dumps(data_sent))

        self.update_env()
        return (
#    self.observation_space_p1, 
#    self.observation_space_p2, 
    self.reward_p1, self.reward_p2, 
    self.done
    )
    def give_reward(self, gameState):
        if gameState["battleState"] == 'win':
            # Positive reward for winning the battlep2
            reward = 1
        elif gameState["battleState"] == 'lose':
            # Negative reward for losing the battle
            reward = -1
        else:
           reward = 0
            #reward = 0.1
            #Other rewards : super effective move, kill, inflict status, remove object, killstreak

        return reward

    async def update_env(self):
        json_data1 = await get_data(self.websocket)
        json_data2 = await get_data(self.websocket)

        # Sort the data for each player
        if (json_data1["player"] != "p1"):
            tmp = json_data1
            json_data1 = json_data2
            json_data2 = tmp

        self.observation_space_p1.append(json_data1["gameState"])
        self.observation_space_p2.append(json_data2["gameState"])
        self.action_space_p1 = json_data1["possibilities"]
        self.action_space_p2 = json_data2["possibilities"]
        self.typerturn_p1 = json_data1["typeturn"]
        self.typerturn_p2 = json_data1["typeturn"]
        self.reward_p1 += self.give_reward(json_data1["gameState"])
        self.reward_p2 += self.give_reward(json_data2["gameState"])
        self.done = self.typerturn_p1 == "end"

    
    def render(self, mode='human'):
        # Render the current state of the environment (optional)
        pass


async def get_data(websocket):
    response = await websocket.recv()
    return json.loads(response)
    


def build_model(input_shape, actions):
    model = Sequential()
    model.add(Flatten(input_shape=input_shape))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(actions, activation='linear'))
    return model

def build_agent(model):
    policy = BoltzmannQPolicy()
    memory = SequentialMemory(limit=50000, window_length=1)
    dqn = DQNAgent(model=model, memory=memory, policy=policy,
                   nb_steps_warmup=10, target_model_update=1e-2,
                   nb_actions=9)
    return dqn

def flatten_dict(d):
    """
    Flatten a nested dictionary into a 1-dimensional dictionary.
    """
    flat_dict = {}
    for key, value in d.items():
        if isinstance(value, dict):
            flat_subdict = flatten_dict(value)
            flat_dict.update({f"{key}_{subkey}": subvalue for subkey, subvalue in flat_subdict.items()})
        else:
            flat_dict[key] = value
    return flat_dict

def convert_value(value):
    """
    Convert string values to numeric using hash().
    """
    if isinstance(value, str):
        return hash(value)
    return value

def dict_to_numpy(d):
    """
    Converts a dictionary to a NumPy array.
    """
    flat_dict = flatten_dict(d)
    flat_dict_numeric = {key: convert_value(value) for key, value in flat_dict.items()}
    return np.array(list(flat_dict_numeric.values()))


def convert_actions(action_space):
    converted_actions = []
    for a in action_space["move"]:
        converted_actions.append("move "+a)
    for a in action_space["switch"]:
        converted_actions.append("switch "+a)
    return converted_actions

async def main():
    env = PokemonBattleEnv()
    observation_space = env.observation_space_p1.shape
    action_space = env.action_space_p1.n

    num_episodes = 10

    # Initialize the DQN model and agents for both players
    model = build_model(observation_space, action_space)
    agent1 = build_agent(model)
    agent2 = build_agent(model)

    for episode in range(num_episodes):
        sum_rewards_p1 = 0
        sum_rewards_p2 = 0
        observation_space_p1, observation_space_p2 = await env.reset()
        
        while not env.done:
            # Convert observation lists to NumPy arrays
            #observation_space_p1_array = dict_to_numpy(observation_space_p1[0])
            #observation_space_p2_array = dict_to_numpy(observation_space_p2[0])
            # Both agents choose actions simultaneously
            #action1 = agent1.model.predict((observation_space_p1_array))
            #action2 = agent2.model.predict(observation_space_p2_array)

            # Apply actions to the environment and observe the new state
            action1 = random.choice(convert_actions(env.action_space_p1))
            action2 = random.choice(convert_actions(env.action_space_p2))
            reward_p1, reward_p2, done = await env.step(action1, action2)

            # Store the transition in the replay memory of both agents
            agent1.memory.append(observation_space_p1, action1, reward_p1, done)
            agent2.memory.append(observation_space_p2, action2, reward_p2, done)

            # Sample mini-batches from the replay memory and train both agents
            agent1.train()
            agent2.train()
        sum_rewards_p1 += env.reward_p1
        sum_rewards_p2 += env.reward_p2

    print("Winrate P1 : %", sum_rewards_p1/num_episodes)
    print("Winrate P2 : %", sum_rewards_p2/num_episodes)


    # Optionally, save the trained model
    agent1.model.save_weights("agent1_weights.h5")
    agent2.model.save_weights("agent2_weights.h5")

    env.close()


if __name__ == "__main__":
    asyncio.run(main())
