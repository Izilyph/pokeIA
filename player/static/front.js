const pokedex = {
    "Bulbasaur": 1,"Ivysaur": 2,"Venusaur": 3,"Charmander": 4,"Charmeleon": 5,"Charizard": 6,"Squirtle": 7,"Wartortle": 8,"Blastoise": 9,"Caterpie": 10,"Metapod": 11,"Butterfree": 12,"Weedle": 13,"Kakuna": 14,"Beedrill": 15,"Pidgey": 16,"Pidgeotto": 17,"Pidgeot": 18,"Rattata": 19,"Raticate": 20,
    "Spearow": 21,"Fearow": 22,"Ekans": 23,"Arbok": 24,"Pikachu": 25,"Raichu": 26,"Sandshrew": 27,"Sandslash": 28,"Nidoran♀": 29,"Nidorina": 30,"Nidoqueen": 31,"Nidoran♂": 32,"Nidorino": 33,"Nidoking": 34,"Clefairy": 35,"Clefable": 36,"Vulpix": 37,"Ninetales": 38,"Jigglypuff": 39,"Wigglytuff": 40,
    "Zubat": 41,"Golbat": 42,"Oddish": 43,"Gloom": 44,"Vileplume": 45,"Paras": 46,"Parasect": 47,"Venonat": 48,"Venomoth": 49,"Diglett": 50,"Dugtrio": 51,"Meowth": 52,"Persian": 53,"Psyduck": 54,"Golduck": 55,"Mankey": 56,"Primeape": 57,"Growlithe": 58,"Arcanine": 59,"Poliwag": 60,
    "Poliwhirl": 61,"Poliwrath": 62,"Abra": 63,"Kadabra": 64,"Alakazam": 65,"Machop": 66,"Machoke": 67,"Machamp": 68,"Bellsprout": 69,"Weepinbell": 70,"Victreebel": 71,"Tentacool": 72,"Tentacruel": 73,"Geodude": 74,"Graveler": 75,"Golem": 76,"Ponyta": 77,"Rapidash": 78,"Slowpoke": 79,"Slowbro": 80,
    "Magnemite": 81,"Magneton": 82,"Farfetch'd": 83,"Doduo": 84,"Dodrio": 85,"Seel": 86,"Dewgong": 87,"Grimer": 88,"Muk": 89,"Shellder": 90,"Cloyster": 91,"Gastly": 92,"Haunter": 93,"Gengar": 94,"Onix": 95,"Drowzee": 96,"Hypno": 97,"Krabby": 98,"Kingler": 99,"Voltorb": 100,
    "Electrode": 101,"Exeggcute": 102,"Exeggutor": 103,"Cubone": 104,"Marowak": 105,"Hitmonlee": 106,"Hitmonchan": 107,"Lickitung": 108,"Koffing": 109,"Weezing": 110,"Rhyhorn": 111,"Rhydon": 112,"Chansey": 113,"Tangela": 114,"Kangaskhan": 115,"Horsea": 116,"Seadra": 117,"Goldeen": 118,"Seaking": 119,"Staryu": 120,
    "Starmie": 121,"Mr. Mime": 122,"Scyther": 123,"Jynx": 124,"Electabuzz": 125,"Magmar": 126,"Pinsir": 127,"Tauros": 128,"Magikarp": 129,"Gyarados": 130,"Lapras": 131,"Ditto": 132,"Eevee": 133,"Vaporeon": 134,"Jolteon": 135,"Flareon": 136,"Porygon": 137,"Omanyte": 138,"Omastar": 139,"Kabuto": 140,
    "Kabutops": 141,"Aerodactyl": 142,"Snorlax": 143,"Articuno": 144,"Zapdos": 145,"Moltres": 146,"Dratini": 147,"Dragonair": 148,"Dragonite": 149,"Mewtwo": 150,"Mew": 151,"Chikorita": 152,"Bayleef": 153,"Meganium": 154,"Cyndaquil": 155,"Quilava": 156,"Typhlosion": 157,"Totodile": 158,"Croconaw": 159,"Feraligatr": 160,
    "Sentret": 161, "Furret": 162, "Hoothoot": 163, "Noctowl": 164, "Ledyba": 165, "Ledian": 166, "Spinarak": 167, "Ariados": 168, "Crobat": 169, "Chinchou": 170, "Lanturn": 171, "Pichu": 172, "Cleffa": 173, "Igglybuff": 174, "Togepi": 175, "Togetic": 176, "Natu": 177, "Xatu": 178, "Mareep": 179, "Flaaffy": 180,
    "Ampharos": 181, "Bellossom": 182, "Marill": 183, "Azumarill": 184, "Sudowoodo": 185, "Politoed": 186, "Hoppip": 187, "Skiploom": 188, "Jumpluff": 189, "Aipom": 190, "Sunkern": 191, "Sunflora": 192, "Yanma": 193, "Wooper": 194, "Quagsire": 195, "Espeon": 196, "Umbreon": 197, "Murkrow": 198, "Slowking": 199,"Misdreavus": 200, 
    "Unown": 201, "Wobbuffet": 202, "Girafarig": 203, "Pineco": 204, "Forretress": 205, "Dunsparce": 206, "Gligar": 207, "Steelix": 208, "Snubbull": 209, "Granbull": 210, "Qwilfish": 211, "Scizor": 212, "Shuckle": 213, "Heracross": 214, "Sneasel": 215, "Teddiursa": 216, "Ursaring": 217, "Slugma": 218,"Magcargo": 219, "Swinub": 220, 
    "Piloswine": 221, "Corsola": 222, "Remoraid": 223, "Octillery": 224, "Delibird": 225, "Mantine": 226, "Skarmory": 227, "Houndour": 228, "Houndoom": 229, "Kingdra": 230, "Phanpy": 231, "Donphan": 232, "Porygon2": 233, "Stantler": 234, "Smeargle": 235, "Tyrogue": 236, "Hitmontop": 237,"Smoochum": 238, "Elekid": 239, "Magby": 240, 
    "Miltank": 241, "Blissey": 242, "Raikou": 243, "Entei": 244, "Suicune": 245, "Larvitar": 246, "Pupitar": 247, "Tyranitar": 248, "Lugia": 249, "Ho-Oh": 250, "Celebi": 251, "Treecko": 252, "Grovyle": 253, "Sceptile": 254, "Torchic": 255, "Combusken": 256,"Blaziken": 257, "Mudkip": 258, "Marshtomp": 259, "Swampert": 260, 
    "Poochyena": 261, "Mightyena": 262, "Zigzagoon": 263, "Linoone": 264, "Wurmple": 265, "Silcoon": 266, "Beautifly": 267, "Cascoon": 268, "Dustox": 269, "Lotad": 270, "Lombre": 271, "Ludicolo": 272, "Seedot": 273, "Nuzleaf": 274,"Shiftry": 275, "Taillow": 276, "Swellow": 277, "Wingull": 278, "Pelipper": 279, "Ralts": 280, 
    "Kirlia": 281, "Gardevoir": 282, "Surskit": 283, "Masquerain": 284, "Shroomish": 285, "Breloom": 286, "Slakoth": 287, "Vigoroth": 288, "Slaking": 289, "Nincada": 290, "Ninjask": 291, "Shedinja": 292,"Whismur": 293, "Loudred": 294, "Exploud": 295, "Makuhita": 296, "Hariyama": 297, "Azurill": 298, "Nosepass": 299, "Skitty": 300, 
    "Delcatty": 301, "Sableye": 302, "Mawile": 303, "Aron": 304, "Lairon": 305, "Aggron": 306, "Meditite": 307, "Medicham": 308, "Electrike": 309, "Manectric": 310,"Plusle": 311,"Minun": 312,"Volbeat": 313,"Illumise": 314,"Roselia": 315,"Gulpin": 316,"Swalot": 317,"Carvanha": 318,"Sharpedo": 319,"Wailmer": 320,
    "Wailord": 321, "Numel": 322, "Camerupt": 323, "Torkoal": 324, "Spoink": 325, "Grumpig": 326, "Spinda": 327, "Trapinch": 328, "Vibrava": 329, "Flygon": 330, "Cacnea": 331, "Cacturne": 332, "Swablu": 333, "Altaria": 334, "Zangoose": 335, "Seviper": 336, "Lunatone": 337, "Solrock": 338, "Barboach": 339, "Whiscash": 340,
    "Corphish": 341,"Crawdaunt": 342, "Baltoy": 343, "Claydol": 344, "Lileep": 345, "Cradily": 346, "Anorith": 347, "Armaldo": 348, "Feebas": 349, "Milotic": 350, "Castform": 351, "Kecleon": 352, "Shuppet": 353, "Banette": 354, "Duskull": 355, "Dusclops": 356, "Tropius": 357, "Chimecho": 358, "Absol": 359, "Wynaut": 360, 
    "Snorunt": 361, "Glalie": 362,"Spheal": 363, "Sealeo": 364, "Walrein": 365, "Clamperl": 366, "Huntail": 367, "Gorebyss": 368, "Relicanth": 369, "Luvdisc": 370, "Bagon": 371, "Shelgon": 372, "Salamence": 373, "Beldum": 374, "Metang": 375, "Metagross": 376, "Regirock": 377, "Regice": 378, "Registeel": 379, "Latias": 380, 
    "Latios": 381, "Kyogre": 382,"Groudon": 383, "Rayquaza": 384, "Jirachi": 385, "Deoxys": 386, "Turtwig": 387, "Grotle": 388, "Torterra": 389, "Chimchar": 390, "Monferno": 391, "Infernape": 392, "Piplup": 393, "Prinplup": 394, "Empoleon": 395, "Starly": 396, "Staravia": 397, "Staraptor": 398, "Bidoof": 399, "Bibarel": 400, 
    "Kricketot": 401, "Kricketune": 402,"Shinx": 403, "Luxio": 404, "Luxray": 405, "Budew": 406, "Roserade": 407, "Cranidos": 408, "Rampardos": 409, "Shieldon": 410, "Bastiodon": 411, "Burmy": 412, "Wormadam": 413, "Mothim": 414, "Combee": 415, "Vespiquen": 416, "Pachirisu": 417, "Buizel": 418, "Floatzel": 419, "Cherubi": 420, 
    "Cherrim": 421, "Shellos": 422,"Gastrodon": 423, "Ambipom": 424, "Drifloon": 425, "Drifblim": 426, "Buneary": 427, "Lopunny": 428, "Mismagius": 429, "Honchkrow": 430, "Glameow": 431, "Purugly": 432, "Chingling": 433, "Stunky": 434, "Skuntank": 435, "Bronzor": 436, "Bronzong": 437, "Bonsly": 438, "Mime Jr.": 439, "Happiny": 440, 
    "Chatot": 441,"Spiritomb": 442, "Gible": 443, "Gabite": 444, "Garchomp": 445, "Munchlax": 446, "Riolu": 447, "Lucario": 448, "Hippopotas": 449, "Hippowdon": 450, "Skorupi": 451, "Drapion": 452, "Croagunk": 453, "Toxicroak": 454, "Carnivine": 455, "Finneon": 456, "Lumineon": 457, "Mantyke": 458, "Snover": 459, "Abomasnow": 460,
    "Weavile": 461, "Magnezone": 462, "Lickilicky": 463, "Rhyperior": 464, "Tangrowth": 465, "Electivire": 466, "Magmortar": 467, "Togekiss": 468, "Yanmega": 469, "Leafeon": 470, "Glaceon": 471, "Gliscor": 472, "Mamoswine": 473, "Porygon-Z": 474, "Gallade": 475, "Probopass": 476, "Dusknoir": 477, "Froslass": 478, "Rotom": 479,"Uxie": 480, 
    "Mesprit": 481, "Azelf": 482, "Dialga": 483, "Palkia": 484, "Heatran": 485, "Regigigas": 486, "Giratina": 487, "Cresselia": 488, "Phione": 489, "Manaphy": 490, "Darkrai": 491, "Shaymin": 492, "Arceus": 493, "Victini": 494, "Snivy": 495, "Servine": 496, "Serperior": 497, "Tepig": 498, "Pignite": 499,"Emboar": 500, 
    "Oshawott": 501, "Dewott": 502, "Samurott": 503, "Patrat": 504, "Watchog": 505, "Lillipup": 506, "Herdier": 507, "Stoutland": 508, "Purrloin": 509, "Liepard": 510, "Pansage": 511, "Simisage": 512, "Pansear": 513, "Simisear": 514, "Panpour": 515, "Simipour": 516, "Munna": 517, "Musharna": 518,"Pidove": 519, "Tranquill": 520, 
    "Unfezant": 521, "Blitzle": 522, "Zebstrika": 523, "Roggenrola": 524, "Boldore": 525, "Gigalith": 526, "Woobat": 527, "Swoobat": 528, "Drilbur": 529, "Excadrill": 530, "Audino": 531, "Timburr": 532, "Gurdurr": 533, "Conkeldurr": 534, "Tympole": 535, "Palpitoad": 536, "Seismitoad": 537,"Throh": 538, "Sawk": 539, "Sewaddle": 540, 
    "Swadloon": 541, "Leavanny": 542, "Venipede": 543, "Whirlipede": 544, "Scolipede": 545, "Cottonee": 546, "Whimsicott": 547, "Petilil": 548, "Lilligant": 549, "Basculin": 550, "Sandile": 551, "Krokorok": 552, "Krookodile": 553, "Darumaka": 554, "Darmanitan": 555,"Maractus": 556, "Dwebble": 557, "Crustle": 558, "Scraggy": 559, "Scrafty": 560, 
    "Sigilyph": 561, "Yamask": 562, "Cofagrigus": 563, "Tirtouga": 564, "Carracosta": 565, "Archen": 566, "Archeops": 567, "Trubbish": 568, "Garbodor": 569, "Zorua": 570, "Zoroark": 571, "Minccino": 572, "Cinccino": 573,"Gothita": 574, "Gothorita": 575, "Gothitelle": 576, "Solosis": 577, "Duosion": 578, "Reuniclus": 579, "Ducklett": 580, 
    "Swanna": 581, "Vanillite": 582, "Vanillish": 583, "Vanilluxe": 584, "Deerling": 585, "Sawsbuck": 586, "Emolga": 587, "Karrablast": 588, "Escavalier": 589, "Foongus": 590, "Amoonguss": 591,"Frillish": 592, "Jellicent": 593, "Alomomola": 594, "Joltik": 595, "Galvantula": 596, "Ferroseed": 597, "Ferrothorn": 598, "Klink": 599, "Klang": 600,
    "Klinklang": 601, "Tynamo": 602, "Eelektrik": 603, "Eelektross": 604, "Elgyem": 605, "Beheeyem": 606, "Litwick": 607, "Lampent": 608, "Chandelure": 609, "Axew": 610, "Fraxure": 611, "Haxorus": 612, "Cubchoo": 613, "Beartic": 614, "Cryogonal": 615, "Shelmet": 616, "Accelgor": 617, "Stunfisk": 618, "Mienfoo": 619, "Mienshao": 620,
    "Druddigon": 621, "Golett": 622, "Golurk": 623, "Pawniard": 624, "Bisharp": 625, "Bouffalant": 626, "Rufflet": 627, "Braviary": 628, "Vullaby": 629, "Mandibuzz": 630, "Heatmor": 631, "Durant": 632, "Deino": 633, "Zweilous": 634, "Hydreigon": 635, "Larvesta": 636, "Volcarona": 637, "Cobalion": 638, "Terrakion": 639,"Virizion": 640, 
    "Tornadus": 641, "Thundurus": 642, "Reshiram": 643, "Zekrom": 644, "Landorus": 645, "Kyurem": 646, "Keldeo": 647, "Meloetta": 648, "Genesect": 649, "Chespin": 650, "Quilladin": 651, "Chesnaught": 652, "Fennekin": 653, "Braixen": 654, "Delphox": 655, "Froakie": 656, "Frogadier": 657,"Greninja": 658, "Bunnelby": 659, "Diggersby": 660, 
    "Fletchling": 661, "Fletchinder": 662, "Talonflame": 663, "Scatterbug": 664, "Spewpa": 665, "Vivillon": 666, "Litleo": 667, "Pyroar": 668, "Flabébé": 669, "Floette": 670, "Florges": 671, "Skiddo": 672, "Gogoat": 673, "Pancham": 674, "Pangoro": 675,"Furfrou": 676, "Espurr": 677, "Meowstic": 678, "Honedge": 679, "Doublade": 680, 
    "Aegislash": 681, "Spritzee": 682, "Aromatisse": 683, "Swirlix": 684, "Slurpuff": 685, "Inkay": 686, "Malamar": 687, "Binacle": 688, "Barbaracle": 689, "Skrelp": 690, "Dragalge": 691, "Clauncher": 692, "Clawitzer": 693,"Helioptile": 694, "Heliolisk": 695, "Tyrunt": 696, "Tyrantrum": 697, "Amaura": 698, "Aurorus": 699, "Sylveon": 700, 
    "Hawlucha": 701, "Dedenne": 702, "Carbink": 703, "Goomy": 704, "Sliggoo": 705, "Goodra": 706, "Klefki": 707, "Phantump": 708, "Trevenant": 709, "Pumpkaboo": 710, "Gourgeist": 711,"Bergmite": 712, "Avalugg": 713, "Noibat": 714, "Noivern": 715, "Xerneas": 716, "Yveltal": 717, "Zygarde": 718, "Diancie": 719, "Hoopa": 720, 
    "Volcanion": 721, "Rowlet": 722, "Dartrix": 723, "Decidueye": 724, "Litten": 725, "Torracat": 726, "Incineroar": 727, "Popplio": 728, "Brionne": 729,"Primarina": 730, "Pikipek": 731, "Trumbeak": 732, "Toucannon": 733, "Yungoos": 734, "Gumshoos": 735, "Grubbin": 736, "Charjabug": 737, "Vikavolt": 738, "Crabrawler": 739, "Crabominable": 740, 
    "Oricorio": 741, "Cutiefly": 742, "Ribombee": 743, "Rockruff": 744, "Lycanroc": 745, "Wishiwashi": 746,"Mareanie": 747, "Toxapex": 748, "Mudbray": 749, "Mudsdale": 750, "Dewpider": 751, "Araquanid": 752, "Fomantis": 753, "Lurantis": 754, "Morelull": 755, "Shiinotic": 756, "Salandit": 757, "Salazzle": 758, "Stufful": 759, "Bewear": 760, 
    "Bounsweet": 761, "Steenee": 762, "Tsareena": 763, "Comfey": 764,"Oranguru": 765, "Passimian": 766, "Wimpod": 767, "Golisopod": 768, "Sandygast": 769, "Palossand": 770, "Pyukumuku": 771, "Type: Null": 772, "Silvally": 773, "Minior": 774, "Komala": 775, "Turtonator": 776, "Togedemaru": 777, "Mimikyu": 778, "Bruxish": 779, "Drampa": 780, 
    "Dhelmise": 781,"Jangmo-o": 782, "Hakamo-o": 783, "Kommo-o": 784, "Tapu Koko": 785, "Tapu Lele": 786, "Tapu Bulu": 787, "Tapu Fini": 788, "Cosmog": 789, "Cosmoem": 790, "Solgaleo": 791, "Lunala": 792, "Nihilego": 793, "Buzzwole": 794, "Pheromosa": 795, "Xurkitree": 796, "Celesteela": 797, "Kartana": 798,"Guzzlord": 799, "Necrozma": 800, 
    "Magearna": 801, "Marshadow": 802, "Poipole": 803, "Naganadel": 804, "Stakataka": 805, "Blacephalon": 806, "Zeraora": 807, "Meltan": 808, "Melmetal": 809, "Grookey": 810, "Thwackey": 811, "Rillaboom": 812, "Scorbunny": 813, "Raboot": 814, "Cinderace": 815,"Sobble": 816, "Drizzile": 817, "Inteleon": 818, "Skwovet": 819, "Greedent": 820,
    "Rookidee": 821, "Corvisquire": 822, "Corviknight": 823, "Blipbug": 824, "Dottler": 825, "Orbeetle": 826, "Nickit": 827, "Thievul": 828, "Gossifleur": 829, "Eldegoss": 830,"Wooloo": 831, "Dubwool": 832, "Chewtle": 833, "Drednaw": 834, "Yamper": 835, "Boltund": 836, "Rolycoly": 837, "Carkol": 838, "Coalossal": 839, "Applin": 840,
    "Flapple": 841, "Appletun": 842, "Silicobra": 843, "Sandaconda": 844, "Cramorant": 845, "Arrokuda": 846, "Barraskewda": 847, "Toxel": 848, "Toxtricity": 849,"Sizzlipede": 850, "Centiskorch": 851, "Clobbopus": 852, "Grapploct": 853, "Sinistea": 854, "Polteageist": 855, "Hatenna": 856, "Hattrem": 857, "Hatterene": 858,"Impidimp": 859, "Morgrem": 860, 
    "Grimmsnarl": 861, "Obstagoon": 862, "Perrserker": 863, "Cursola": 864, "Sirfetch'd": 865, "Mr. Rime": 866, "Runerigus": 867,"Milcery": 868, "Alcremie": 869, "Falinks": 870, "Pincurchin": 871, "Snom": 872, "Frosmoth": 873, "Stonjourner": 874, "Eiscue": 875, "Indeedee": 876, "Morpeko": 877,"Cufant": 878, "Copperajah": 879, "Dracozolt": 880,
    "Arctozolt": 881, "Dracovish": 882, "Arctovish": 883, "Duraludon": 884, "Dreepy": 885, "Drakloak": 886, "Dragapult": 887,"Zacian": 888, "Zamazenta": 889, "Eternatus": 890, "Kubfu": 891, "Urshifu": 892, "Zarude": 893, "Regieleki": 894, "Regidrago": 895, "Glastrier": 896, "Spectrier": 897,"Calyrex": 898,"Wyrdeer":899,"Kleavor":900,
    "Ursaluna":901,"Basculegion":902,"Sneasler":903,"Overqwil":904,"Enamorus":905,"Sprigatito":906,"Floragato":907,"Meowscarada":908,"Fuecoco":909,"Crocalor":910,"Skeledirge":911,"Quaxly":912,"Quaxwell":913,"Quaquaval":914,"Lechonk":915,"Oinkologne":916,"Tarountula":917,"Spidops":918,"Nymble":919,"Lokix":920,
    "Pawmi":921,"Pawmo":922,"Pawmot":923,"Tandemaus":924,"Maushold":925,"Fidough":926,"Dachsbun":927,"Smoliv":928,"Dolliv":929,"Arboliva":930,"Squawkabilly":931,"Nacli":932,"Naclstack":933,"Garganacl":934,"Charcadet":935,"Armarouge":936,"Ceruledge":937,"Tadbulb":938,"Bellibolt":939,"Wattrel":940,
    "Kilowattrel":941,"Maschiff":942,"Mabosstiff":943,"Shroodle":944,"Grafaiai":945,"Bramblin":946,"Brambleghast":947,"Toedscool":948,"Toedscruel":949,"Klawf":950,"Capsakid":951,"Scovillain":952,"Rellor":953,"Rabsca":954,"Flittle":955,"Espathra":956,"Tinkatink":957,"Tinkatuff":958,"Tinkaton":959,"Wiglett":960,
    "Wugtrio":961,"Bombirdier":962,"Finizen":963,"Palafin":964,"Varoom":965,"Revavroom":966,"Cyclizar":967,"Orthworm":968,"Glimmet":969,"Glimmora":970,"Greavard":971,"Houndstone":972,"Flamigo":973,"Cetoddle":974,"Cetitan":975,"Veluza":976,"Dondozo":977,"Tatsugiri":978,"Annihilape":979,"Clodsire":980,
    "Farigiraf":981,"Dudunsparce":982,"Kingambit":983,"Great Tusk":984,"Scream Tail":985,"Brute Bonnet":986,"Flutter Mane":987,"Slither Wing":988,"Sandy Shocks":989,"Iron Treads":990,"Iron Bundle":991,"Iron Hands":992,"Iron Jugulis":993,"Iron Moth":994,"Iron Thorns":995,"Frigibax":996,"Arctibax":997,"Baxcalibur":998,"Gimmighoul":999,"Gholdengo":1000,
    "Wo-Chien":1001,"Chien-Pao":1002,"Ting-Lu":1003,"Chi-Yu":1004,"Roaring Moon":1005,"Iron Valiant":1006,"Koraidon":1007,"Miraidon":1008,"Walking Wake":1009,"Iron Leaves":1010,"Dipplin":1011,"Poltchageist":1012,"Sinistcha":1013,"Okidogi":1014,"Munkidori":1015,"Fezandipiti":1016,"Ogerpon":1017,"Ogerpon Wellspring Mask":10273,"Ogerpon Hearthflame Mask":10274,"Ogerpon Cornerstone Mask":10275,"Archaludon":1018,"Hydrapple":1019,"Gouging Fire":1020,
    "Raging Bolt":1021,"Iron Boulder":1022,"Iron Crown":1023,"Terapagos":1024,"Terapagos Terastal Form":10276,"Terapagos Stellar Form":10277,"Pecharunt":1025,"Zamazenta-Crowned":10189,"Zacian-Crowned":10188,"Lycanroc-Midnight":10126,"Lycanroc-Dusk":745,"Urshifu-Rapid-Strike":10191,"Tornadus-Therian":10019,"Thundurus-Therian":10020,"Landorus-Therian":10021,
    "Lilligant-Hisui":10237,"Muk-Alola":10113,"Toxtricity-Low-Key":10184,"Giratina-Origin":10007,"Sawsbuck-Winter":"586-winter","Sawsbuck-Summer":"586-summer","Sawsbuck-Autumn":"586-autumn","Oinkologne-F":10254,"Tatsugiri-Droopy":10258,"Tatsugiri-Stretchy":10259,"Tatsugiri-Curly":978,"Squawkabilly-Green":931,"Squawkabilly-Blue":10260,"Squawkabilly-Yellow":10261,"Squawkabilly-White":10262,
    "Gastrodon-East":"423-east","Gastrodon-West":"423-west","Dialga-Origin":10245,"Palkia-Origin":10246,"Arceus-Flying":"493-flying","Arceus-Bug":"493-bug","Arceus-Fire":"493-fire","Arceus-Dark":"493-dark","Arceus-Fairy":"493-fairy","Arceus-Ground":"493-grond","Arceus-Electric":"493-electric","Arceus-Rock":"493-Rock","Arceus-Water":"493-water","Arceus-Steel":"493-steel","Arceus-Ghost":"493-ghost",
    "Arceus-Psychic":"493-psychic","Arceus-Fighting":"493-fighting","Arceus-Grass":"493-grass","Arceus-Ice":"493-ice","Arceus-Poison":"493-poison","Arceus-Dragon":"493-dragon","Typhlosion-Hisui":10233,"Samurott-Hisui":"10236","Qwilfish-Hisui":10234,"Electrode-Hisui":10232,"Decidueye-Hisui":10244,"Dudunsparce-Three-Segment":10255,
    "Persian-Alola":10108,"Moltres-Galar":10171,"Zapdos-Galar":10170,"Articuno-Galar":10169,"Eiscue-Noice":10185,"Raichu-Alola":10100,"Dugtrio-Alola":10106,"Goodra-Hisui":10242,"Indeedee-F":876,"Oricorio-Sensu":10125,"Oricorio-Pom-Pom":10123,"Oricorio-Pa'u":10124,"Maushold-Four":925,"Basculegion-F":10248,"Palafin-Hero":10256,
    "Arcanine-Hisui":10230,"Avalugg-Hisui":10243,"Zoroark-Hisui":10239,"Braviary-Hisui":10240,"Basculin-Blue-Striped":"550-blue-striped","Basculin-Red-Striped":"550-red-striped","Pikachu-Unova":25,"Pikachu-Hoenn":25,"Vivillon-Elegant":666,"Rotom-Heat":10008,"Rotom-Wash":10009,"Rotom-Frost":10010,
    "Rotom-Fan":10011,"Rotom-Mow":10012,"Enamorus-Therian":10249,"Hoopa-Unbound":10086,"Vivillon-Savanna":666,"Mimikyu-Busted":10143,"Tauros-Paldea-Blaze":10251,"Tauros-Paldea-Aqua":10252,"Tauros-Paldea":10250,"Calyrex-Shadow":10194,"Calyrex-Ice":10193,"Vivillon-Marine":666,"Vivillon-Icy Snow":666,"Vivillon-Garden":666,
    "Slowbro-Galar":10165,"Slowking-Galar":10172,"Vivillon-Tundra":666,"Vivillon-Sandstorm":666,"Vivillon-Monsoon":666,"Pikachu-Original":25,"Pikachu-Partner":25,"Vivillon-Polar":666,"Vivillon-Jungle":666
}

const statusColor = {
    "psn":"#A040A0",
    "tox":"#A040A0",
    "brn":"#F08030",
    "slp":"#A890F0",
    "par":"#F8D030",
    "frz":"#98D8D8",
    "fnt":"#A8A878"
}

const typeColor= {
    "Electric":"#F7D02C",
    "Dark":"#705746",
    "Grass":"#7AC74C",
    "Normal":"#A8A77A",
    "Fire": "#EE8130",
    "Water":"#6390F0",
    "Ice":"#96D9D6",
    "Fighting":"#C22E28",
    "Poison":"#A33EA1",
    "Flying":"#A98FF3",
    "Ground":"#E2BF65",
    "Psychic":"#F95587",
    "Bug":"#A6B91A",
    "Rock":"#B6A136",
    "Ghost":"#735797",
    "Dragon":"#6F35FC",
    "Steel":"#B7B7CE",
    "Fairy":"#D685AD"
}

function updateActivePokemon(allyActive, ennemyActive){
    $(".history").show();
    const allyName = allyActive.name;
    const allyNumber = pokedex[allyName];
    const allyStatus = allyActive.status;
    const allyAbility = allyActive.ability;

    const ennemyName = ennemyActive.name;
    const ennemyNumber = pokedex[ennemyName];
    const ennemyStatus = ennemyActive.status;
    const ennemyAbility = ennemyActive.abilities;
    $('#active1').text(allyName +" L"+allyActive.lv);
    $("#ally-pokemon-img").attr('src','static/sprites/sprites/pokemon/other/showdown/back/'+allyNumber+'.gif');
    $("#ally-pokemon-img").show();
    $('.pokemon-health-bar').show();

    if(allyNumber > 920){
        $("#ally-pokemon-img").attr('src','static/sprites/sprites/pokemon/'+allyNumber+'.png');
    }

    if(allyStatus!="None"){
        $('#ally-pokemon-status').show();
        $('#ally-pokemon-status').text(allyStatus.charAt(0).toUpperCase() + allyStatus.slice(1));
        $('#ally-pokemon-status').css('background-color',statusColor[allyStatus])
    }else{
        $('#ally-pokemon-status').hide();
    }

    $('#active2').text(ennemyName+" L"+ennemyActive.lv);
    $("#ennemy-pokemon-img").attr('src','static/sprites/sprites/pokemon/other/showdown/'+ennemyNumber+'.gif');
    $("#ennemy-pokemon-img").show();
    if(ennemyNumber > 920){
        $("#ennemy-pokemon-img").attr('src','static/sprites/sprites/pokemon/'+ennemyNumber+'.png');
    }

    if(ennemyStatus!="None"){
        $('#ennemy-pokemon-status').show();
        $('#ennemy-pokemon-status').text(ennemyStatus.charAt(0).toUpperCase() + ennemyStatus.slice(1));
        $('#ennemy-pokemon-status').css('background-color',statusColor[ennemyStatus])
    }else{
        $('#ennemy-pokemon-status').hide();
    }
    const allyHP = allyActive.condition.split(/[/ ]/);
    let allyHPPercent = Math.floor(100*parseInt(allyHP[0])/parseInt(allyHP[1]));
    if(allyHP[1]==="fnt"){
        allyHPPercent = 0;
    }
    updateHealthBar(allyHPPercent,1);
    updateHealthBar(ennemyActive.currentHP,2);
    $('#ally-item').text("Item: "+allyActive.item.charAt(0).toUpperCase() +allyActive.item.slice(1));
    if(allyActive.item===""){
        $('#ally-item').text("Item: None");
    }
    $('#ally-ability').text("Ability: "+allyAbility);
    console.log("AAA:"+ennemyAbility);
    const abilities = Object.keys(ennemyAbility);
    if(abilities.length!=1){
        let str ="";
        abilities.forEach(ability =>str += ennemyAbility[ability] + ", ");
        
        $('#ennemy-ability').text("Possible abilities: "+str.slice(0,-2));
    }else{
        $('#ennemy-ability').text("Ability: "+ennemyAbility['0']);

    }
    $("#ally-types").empty();
    for(type in allyActive.types){
        let div = $('<div>');
        div.text(allyActive.types[type]);
        div.css('background-color',typeColor[allyActive.types[type]]);
        div.addClass('type-bubble');
        $("#ally-types").append(div);
    }
    $("#ennemy-types").empty();
    for(type in ennemyActive.types){
        let div = $('<div>');
        div.text(ennemyActive.types[type]);
        div.css('background-color',typeColor[ennemyActive.types[type]]);
        div.addClass('type-bubble');
        $("#ennemy-types").append(div);
    }
    $('#ally-stats').empty();
    Object.keys(allyActive.stats).forEach(stat => {
        let div = $('<div>');
        div.text(stat.charAt(0).toUpperCase() + stat.slice(1) + ": " + allyActive.stats[stat]);
        $('#ally-stats').append(div);
    });
    $(".ennemy-boost-items").empty();
    $(".ennemy-boost-txt").text("Stats Modifiers:");
    let isNull = true;
    Object.keys(ennemyActive.statsModifiers).forEach(stat => {
        let div = $('<div>');
        div.text(stat.charAt(0).toUpperCase() + stat.slice(1)+": "); 
        const statVal = ennemyActive.statsModifiers[stat];
        if(statVal.boost!=0){
            let boostDiv = $('<div>');
            boostDiv.addClass("boost-div");
            boostDiv.text("+"+ennemyActive.statsModifiers[stat].boost);
            div.append(boostDiv);
            
        }
        if(statVal.unboost!=0){
            let unboostDiv = $('<div>');
            unboostDiv.addClass("unboost-div");
            unboostDiv.text("-"+ennemyActive.statsModifiers[stat].unboost);
            div.append(unboostDiv);
        }

        if(statVal.unboost!=0 || statVal.boost!=0){
            $(".ennemy-boost-items").append(div);
            isNull = false;
        }
    });
    if(isNull){
        $(".ennemy-boost-txt").text("Stats Modifiers: None");
        $(".ennemy-boost-items").css('border','');

    }else{
        $(".ennemy-boost-items").css('border','1px solid black');
    }

    $("#ally-volatile").empty();
    const allyVolatile = allyActive.volatileStatus;
    if(allyVolatile.length!=0){
        let str = "";
        for(volatile in allyVolatile){
            if(allyVolatile[volatile]!="Protect"){
                str += allyVolatile[volatile] +", ";
            }
        }
        $("#ally-volatile").text("Volatile Status: "+str.slice(0,-2));
    }else{
        $("#ally-volatile").text("Volatile Status: None");
    }

    $("#ennemy-volatile").empty();
    const ennemyVolatile = ennemyActive.volatileStatus;
    if(ennemyVolatile.length!=0){
        let str = "";
        for(volatile in ennemyVolatile){
            if(ennemyVolatile[volatile]!="Protect"){
                str += ennemyVolatile[volatile] +", ";
            }
        }
        
        $("#ennemy-volatile").text("Volatile Status: "+str.slice(0,-2));
        if(str==""){
            $("#ennemy-volatile").text("Volatile Status: None");
        }

    }else{
        $("#ennemy-volatile").text("Volatile Status: None");
    }

    $("#ally-pokemon-infos").show();
    $("#ennemy-pokemon-infos").show();
}

function updateHealthBar(percentage,pokemon) {
    healthBar = $('#pokemon-health-bar'+pokemon);
    percentage = Math.min(Math.max(percentage, 0), 100);
    healthBar.css('width',percentage + '%');
    if (percentage < 20) {
        healthBar.addClass('critical-health');
    } else if (percentage < 50) {
        healthBar.addClass('low-health');
        healthBar.removeClass('critical-health');
    } else {
        healthBar.removeClass('low-health');
        healthBar.removeClass('critical-health');
    }
}


function updateEnnemyTeam(pokemons){
    $(".ennemy-team").empty();
    for(let i = 0; i <6;i++){
        let div = $('<div>');
        let img = $('<img>');
        img.attr('src','static/sprites/sprites/items/poke-ball.png');
        div.attr('id','ennemyTeamPokemon'+i);
        div.attr('class','ennemyTeamPokemon');
        div.append(img);
        $(".ennemy-team").append(div);  
    }
    let i = 0;
    Object.keys(pokemons).forEach( pokemon => {
        const ennemyPokemon = $("#ennemyTeamPokemon"+i);
        ennemyPokemon.empty();
        let img = $('<img>');
        img.attr('src','static/sprites/sprites/pokemon/'+ pokedex[pokemon]+'.png');
        img.css('width','30%');
        let div = $('<div>');
        div.attr('class','ennemy-team-name');
        div.text(pokemon);
        let hpbar = $('<div>');
        hpbar.attr('class','hpbar');
        let hpBarSpan = $('<span>');
        hpBarSpan.css('width',pokemons[pokemon].currentHP +'%');
        hpBarSpan.attr('class','pokemon-health-bar-inner');
        if (pokemons[pokemon].currentHP < 20) {
            hpBarSpan.addClass('critical-health');
        } else if (pokemons[pokemon].currentHP < 50) {
            hpBarSpan.addClass('low-health');
            hpBarSpan.removeClass('critical-health');
        } else {
            hpBarSpan.removeClass('low-health');
            hpBarSpan.removeClass('critical-health');
        }
        hpbar.append(hpBarSpan);
        let statusDiv = $('<div>');
        const ennemyStatus = pokemons[pokemon].status;
        statusDiv.attr('class','ennemy-team-status');
        if(ennemyStatus!="None"){
            statusDiv.text(ennemyStatus.charAt(0).toUpperCase() + ennemyStatus.slice(1));
            statusDiv.css('background-color',statusColor[ennemyStatus]);
        }
        if(pokemons[pokemon].currentHP == 0){
            statusDiv.text('Fnt');
            statusDiv.css('background-color',statusColor['fnt']);
        }

        let item = $('<div>');
        let pkmItem = pokemons[pokemon].item;
        item.text("Item: "+pkmItem.charAt(0).toUpperCase() + pkmItem.slice(1));
        if(pkmItem===""){
            item.text("Item: None");
        }
        item.attr('class','ennemy-team-item');
        ennemyPokemon.append(img);
        ennemyPokemon.append(div);
        ennemyPokemon.append(hpbar);
        ennemyPokemon.append(item);
        ennemyPokemon.append(statusDiv);
        if(ennemyStatus!="None" || pokemons[pokemon].currentHP == 0){
            statusDiv.show();
        }
        i++;
    });
    $(".ennemy-team-container").show();
}

function updateHistory(moves){
    for(move in moves){
        let p = $('<div>').addClass('history-item');
        p.text(moves[move]);
        $(".history-items").append(p);
        p[0].offsetHeight; 
        p.css('opacity', '1');
        $(".history-items").scrollTop($('.history-items')[0].scrollHeight);
    }

}

function updateTerrain(field,hazardsAlly,hazardsEnnemy,weather){
    const weatherDiv = $(".weather");
    weatherDiv.hide();
    switch(weather){
        case "Snow":
            weatherDiv.css('background-color','rgba(173, 216, 230, 0.4)');
            weatherDiv.show();
            break;
        case "SunnyDay":
            weatherDiv.css('background-color','rgba(255, 215, 0, 0.2)');
            weatherDiv.show();
            break;

        case "RainDance":
            weatherDiv.css('background-color','rgba(30, 59, 90, 0.3)');
            weatherDiv.show();
            break; 
        case "Sandstorm":
            weatherDiv.css('background-color','rgba(237, 201, 175, 0.5)');
            weatherDiv.show();
            break; 

        case "none":
            weatherDiv.hide();
            break;
    }
    let str="";
    Object.keys(field).forEach(effect => {
        if(field[effect]){
            str += effect +', ';
        }
    });
    $(".field-effect").text(str.slice(0,-2));
    if(str!=""){
        $(".field").show();
    }else{
        $(".field").hide();
    }
    let str2="";
    Object.keys(hazardsAlly).forEach(effect => {
        if(hazardsAlly[effect]){
            str2 += effect +', ';
        }
    });
    $(".ally-hazards-list").text(str2.slice(0,-2));
    if(str2!=""){
        $(".ally-hazards").show();
    }else{
        $(".ally-hazards").hide();
    }
    let str3="";
    Object.keys(hazardsEnnemy).forEach(effect => {
        if(hazardsEnnemy[effect]){
            str3 += effect +', ';
        }
    });
    $(".ennemy-hazards-list").text(str3.slice(0,-2));
    if(str3!=""){
        $(".ennemy-hazards").show();
    }else{
        $(".ennemy-hazards").hide();
    }

}

function displayEnd(end){
    const divEnd = $(".battle-end");
    divEnd.empty();
    if(end==="loose"){
        divEnd.text("Oh no you lost!");
    }else if(end==="win"){
        divEnd.text("You win! Well Played!");

    }else{
        divEnd.text("Wow, it's a tie!");
    }
    divEnd.show();
}
