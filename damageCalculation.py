import math

"""Damage Formula

Where:
level -- level of attacking pokemon
offense -- attack or specil attack of the attacking pokemon
defense -- defense or special defense of the defending pokemon
basePower -- base power of the move used
targets -- 1, 0.75 or 0.5 depending on the number of targets
weather -- 1.5, 1 or 0.5 depending on the current weather
badge -- deprecated factor, 1.25 in Gen 2, 1 elsewhere
critical -- 1.5 if attack lands as a critical hit, 1 otherwise
stab -- Same Type Attack Bonus, 1, 1.5 or 2 depending on attacking pokemon type and ability
type -- effectiveness of a move towards the defending pokemon
burn -- 0.5 if the attacking pokemon is burned and uses a physical move, 1 otherwise
other -- 1 by default, miscellaneous  factors determined by specific moves, abilities or items
Return: damage received by the defending pokemon
"""


def dmgCalculation(level,offense,defense,basePower,targets,weather,badge,critical,stab,type,burn,other):
    baseDamage = math.floor(math.floor(math.floor((2 * level) / 5 + 2) * basePower * offense / defense) / 50 + 2)
    multipliers = targets * weather * badge * critical * stab * type * burn * other
    rolls = []
    for i in range(0,16):
        rolls.append(math.floor(baseDamage * multipliers * (0.85+i/100)))
    return rolls




print(dmgCalculation(100,100,100,90,1.0,1.0,1.0,1.0,1.5,0.5,1.0,1.0))
