import gym
from gym import spaces
import numpy as np
import websockets
import json
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Flatten
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from rl.agents import DQNAgent, DDPGAgent
from rl.policy import BoltzmannQPolicy
from rl.memory import SequentialMemory
from rl.random import OrnsteinUhlenbeckProcess
import asyncio
import random
import pandas as pd
import ray
from ray import tune
from ray.rllib.agents import ddpg



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
        self.websocket = await websockets.connect(uri)
        json_data1 = await get_data(self.websocket)
        json_data2 = await get_data(self.websocket)
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
        data_sent = {
           "game_id": self.gameID,
           "moves": moves
        }
        await self.websocket.send(json.dumps(data_sent))

        await self.update_env()
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
        self.typerturn_p2 = json_data2["typeturn"]
        self.reward_p1 += self.give_reward(json_data1["gameState"])
        self.reward_p2 += self.give_reward(json_data2["gameState"])
        self.done = self.typerturn_p1 == "end"

    
    def render(self, mode='human'):
        # Render the current state of the environment (optional)
        pass


async def get_data(websocket):
    response = await websocket.recv()
    return json.loads(response)
    

"""
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

    flat_dict = {}
    for key, value in d.items():
        if isinstance(value, dict):
            flat_subdict = flatten_dict(value)
            flat_dict.update({f"{key}_{subkey}": subvalue for subkey, subvalue in flat_subdict.items()})
        else:
            flat_dict[key] = value
    return flat_dict

def convert_value(value):

    if isinstance(value, str):
        return hash(value)
    return value

def dict_to_numpy(d):

    flat_dict = flatten_dict(d)
    flat_dict_numeric = {key: convert_value(value) for key, value in flat_dict.items()}
    return np.array(list(flat_dict_numeric.values()))

"""

def convert_observation(observation):
    # Initialize an empty array
    observation_array = []

    # Add info about your team
    pokemons = list(observation["yourTeam"]["pokemons"].values())
    for pokemon in pokemons:

        # Add the name of the pokemon
        observation_array.append(pokemon["name"])

        # Add the stats of the pokemon
        sub_arr = list(pokemon["stats"].values())
        observation_array = observation_array + sub_arr

        # Add the condition of the pokemon
        observation_array.append(pokemon["condition"])

        # Add the status of the pokemon
        observation_array.append(pokemon["status"])

        # Add the moves of the pokemon
        for move in pokemon["moves"]:
            sub_arr = list(move.values())
            sub_arr.remove(move["flags"])
            observation_array = observation_array + sub_arr
        
        # Add the ability of the pokemon
        observation_array.append(pokemon["ability"])

        # Add the item of the pokemon
        observation_array.append(pokemon["item"])
        
        # Add the types of the pokemon
        observation_array = observation_array + pokemon["types"]
        # Add None if the pokemon only has one type 
        if len(pokemon["types"]) != 2:
            observation_array.append(None)

        # Add the volatile status of the pokemon
        if len(pokemon["volatileStatus"]) != 0:
            observation_array.append(pokemon["volatileStatus"][0])
        else:
            observation_array.append("None")
        
        # Add the boosts of the pokemon
        if(pokemon["name"] == observation["yourTeam"]["active"]["name"]):
            for stat_boost in list(observation["yourTeam"]["active"]["statsModifiers"].values()):
                boost = stat_boost["boost"] - stat_boost["unboost"]
                observation_array.append(boost)
        else:
            observation_array = observation_array + [0, 0, 0, 0, 0, 0]
            

        #Add a boolean to describe if the pokemon is in battle
        if (pokemon["name"] == observation["yourTeam"]["active"]["name"]):
            observation_array.append(True)
        else:
            observation_array.append(False)

    # Add last move used by the active pokemon
    sub_arr = list(observation["yourTeam"]["lastMove"].values())
    if len(sub_arr) == 0: sub_arr = ["None", "None", "None"] 
    observation_array = observation_array + sub_arr

    # Add info about the enemy team
    enemy_pokemons = list(observation["ennemyTeam"]["pokemons"].values())
    enemy_pokemons_names = list(observation["ennemyTeam"]["pokemons"].keys())

    counter = 0
    for pokemon in enemy_pokemons:
        # Add the name of the pokemon
        pokemon_name = enemy_pokemons_names[counter]
        observation_array.append(pokemon_name)

        counter += 1
        # Add the stats of the pokemon
        sub_arr = list(pokemon["statsAfterBoost"].values())
        observation_array = observation_array + sub_arr

        # Add the condition of the pokemon
        observation_array.append(pokemon["currentHP"])

        # Add the status of the pokemon
        observation_array.append(pokemon["status"])

        # Add the moves of the pokemon
        for move in dict(pokemon["moves"]).values():
            sub_arr = list(dict(move).values())
            sub_arr.remove(move["flags"])
            observation_array = observation_array + sub_arr
        
        # Add the ability of the pokemon
        sub_arr = list(dict(pokemon["abilities"]).values())[:3]
        for i in range(3 - len(sub_arr)):
            sub_arr.append("None")
        observation_array = observation_array + sub_arr

        # Add the item of the pokemon
        observation_array.append(pokemon["item"])
        
        # Add the types of the pokemon
        observation_array = observation_array + pokemon["types"]
        # Add None if the pokemon only has one type 
        if len(pokemon["types"]) != 2:
            observation_array.append(None)

        # Add the volatile status of the pokemon
        if len(pokemon["volatileStatus"]) != 0:
            observation_array.append(pokemon["volatileStatus"][0])
        else:
            observation_array.append("None")

        # Add the boosts of the pokemon
        for stat_boost in list(pokemon["statsModifiers"].values()):
            boost = stat_boost["boost"] - stat_boost["unboost"]
            observation_array.append(boost)
        
        #Add a boolean to describe if the pokemon is in battle
        if (pokemon_name == observation["ennemyTeam"]["active"]["name"]):
            observation_array.append(True)
        else:
            observation_array.append(False)

    for i in range(6 - len(enemy_pokemons_names)):
        for j in range(30):
            observation_array.append("None")

    # Add last move used by the active pokemon
    sub_arr = list(observation["ennemyTeam"]["lastMove"].values())
    if len(sub_arr) == 0: sub_arr = ["None", "None", "None"] 
    observation_array = observation_array + sub_arr

    # Add weather
    observation_array.append(observation["weather"])

    # Add ground hazards and effects

    hazards = observation["ground"]["hazards"]
    hazard_keys = hazards.keys()
    if ("Stealth Rock" in hazard_keys):
        observation_array.append(hazards["Stealth Rock"])
    else:
        observation_array.append(False)
    if ("Spikes" in hazard_keys):
        observation_array.append(hazards["Spikes"])
    else:
        observation_array.append(False)
    if ("Toxic Spikes" in hazard_keys):
        observation_array.append(hazards["Toxic Spikes"])
    else:
        observation_array.append(False)
    if ("Sticky Web" in hazard_keys):
        observation_array.append(hazards["Sticky Web"])
    else:
        observation_array.append(False)
    if ("Reflect" in hazard_keys):
        observation_array.append(hazards["Reflect"])
    else:
        observation_array.append(False)
    if ("Light Screen" in hazard_keys):
        observation_array.append(hazards["Light Screen"])
    else:
        observation_array.append(False)
    if ("Aurora Veil" in hazard_keys):
        observation_array.append(hazards["Aurora Veil"])
    else:
        observation_array.append(False)
    
    field = observation["ground"]["field"]
    field_keys = field.keys()
    if ("Grassy Terrain" in field_keys):
        observation_array.append(field["Grassy Terrain"])
    else:
        observation_array.append(False)
    if ("Electric Terrain" in field_keys):
        observation_array.append(field["Electric Terrain"])
    else:
        observation_array.append(False)
    if ("Psychic Terrain" in field_keys):
        observation_array.append(field["Psychic Terrain"])
    else:
        observation_array.append(False)
    if ("Misty Terrain" in field_keys):
        observation_array.append(field["Misty Terrain"])
    else:
        observation_array.append(False)
    if ("Trick Room" in field_keys):
        observation_array.append(field["Trick Room"])
    else:
        observation_array.append(False)
    return observation_array

def convert_actions(action_space):
    converted_actions = []
    for a in action_space["move"]:
        converted_actions.append("move "+a)
    for a in action_space["switch"]:
        converted_actions.append("switch "+a)
    return converted_actions

# Define the MADDPG agent class
class MADDPGAgent:
    def __init__(self, num_agents, state_size, action_size):
        self.num_agents = num_agents
        self.state_size = state_size
        self.action_size = action_size
        self.agents = [self.build_agent() for _ in range(num_agents)]
        
    def build_agent(self):
        model = Sequential([
            Dense(64, activation='relu', input_shape=(self.state_size,)),
            Dense(64, activation='relu'),
            Dense(self.action_size, activation='linear')
        ])
        memory = SequentialMemory(limit=100000, window_length=1)
        policy = OrnsteinUhlenbeckProcess(theta=0.15, mu=0., sigma=0.3)
        agent = DDPGAgent(
            model=model,
            memory=memory,
            policy=policy,
            nb_actions=self.action_size,
            nb_steps_warmup_actor=100,
            nb_steps_warmup_critic=100,
            target_model_update=1e-3
        )
        agent.compile(Adam(lr=1e-3), metrics=['mae'])
        return agent
    
    def train(self, env, nb_steps):
        self.agents[0].fit(env, nb_steps=nb_steps, visualize=False, verbose=1)
        
    def test(self, env, nb_episodes):
        return self.agents[0].test(env, nb_episodes=nb_episodes, visualize=False)


def flatten(d, ret=None):
    if ret is None:
        ret = []
    for k, v in sorted(d.items()):
        ret.append(k)
        if v:
            flatten(v, ret)
    return ret


async def main():
    env = PokemonBattleEnv()
    observation_space = env.observation_space_p1.shape
    action_space = env.action_space_p1.n

    num_episodes = 100
    game_nb = 0
    # Initialize the DQN model and agents for both players
 #   model = build_model(observation_space, action_space)
 #   agent1 = build_agent(model)
 #   agent2 = build_agent(model)
    

    num_agents = 2
    state_size = 4
    action_size = 9

    # Create MADDPG agent
    #maddpg_agent = MADDPGAgent(num_agents, state_size, action_size)

    # Train the agent
    # maddpg_agent.train(env, nb_steps=10000)

    # Test the agent
    # maddpg_agent.test(env, nb_episodes=10)

    for episode in range(num_episodes):
        
        sum_rewards_p1 = 0
        sum_rewards_p2 = 0
        observation_space_p1, observation_space_p2 = await env.reset()
        #print(observation_space_p1[0])
        #convert_observation(observation_space_p1[0])
        
        bite = 0
        while not env.done and bite < 30:
            bite += 1
            # Convert observation lists to NumPy arrays
            #df = pd.json_normalize(observation_space_p1[0]) 
            #print(df.head)
            #df_array = df.values
            #print(df_array)
            #observation_space_p1_array = flatten(observation_space_p1[0])
            #observation_space_p2_array = flatten(observation_space_p2[0])

            # Both agents choose actions simultaneously
            #action1 = agent1.model.predict((observation_space_p1_array))
            #action2 = agent2.model.predict(observation_space_p2_array)

            # Apply actions to the environment and observe the new state
            #print("actions1 : ", env.action_space_p1)
            #print("actions2 : ", env.action_space_p2)
            #print(env.typerturn_p1)
            #print(env.typerturn_p2)
            if env.typerturn_p1 != "wait" and env.typerturn_p1 != "end":
                action1 = random.choice(convert_actions(env.action_space_p1))
            if env.typerturn_p2 != "wait" and env.typerturn_p2 != "end":
                action2 = random.choice(convert_actions(env.action_space_p2))
            reward_p1, reward_p2, done = await env.step(action1, action2)
        
        game_nb = game_nb + 1
        #print("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAME NB : ", game_nb)

            # Store the transition in the replay memory of both agents
 #           agent1.memory.append(observation_space_p1, action1, reward_p1, done)
 #           agent2.memory.append(observation_space_p2, action2, reward_p2, done)

            # Sample mini-batches from the replay memory and train both agents
 #           agent1.train()
 #           agent2.train()
        print("Tour : ", bite)
        print("HAZARDDDDDDDDDDDDDDDDDDDDDDDDDDDS", env.observation_space_p1[29]["ground"])
        convert_observation(env.observation_space_p1[29])
        break
        sum_rewards_p1 += env.reward_p1
        sum_rewards_p2 += env.reward_p2
    

  #  print("Rewards P1 : ", sum_rewards_p1)
  #  print("Rewards P2 : ", sum_rewards_p2)


    # Optionally, save the trained model
 #   agent1.model.save_weights("agent1_weights.h5")
  #  agent2.model.save_weights("agent2_weights.h5")

    env.close()


if __name__ == "__main__":
    asyncio.run(main())
