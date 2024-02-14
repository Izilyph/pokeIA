import time

from flask import Flask, render_template
import pypokedex

app = Flask(__name__)

dlc_pokemons = {
    "Walking Wake": 1009,
    "Iron Leaves": 1010,
    "Dipplin": 1011,
    "Poltchageist": 1012,
    "Sinistcha": 1013,
    "Okidogi": 1014,
    "Munkidori": 1015,
    "Fezandipiti": 1016,
    "Ogerpon": 1017,
    "Ogerpon Wellspring Mask": 10273,
    "Ogerpon Hearthflame Mask": 10274,
    "Ogerpon Cornerstone Mask": 10275,
    "Archaludon": 1018,
    "Hydrapple": 1019,
    "Gouging Fire": 1020,
    "Raging Bolt": 1021,
    "Iron Boulder": 1022,
    "Iron Crown": 1023,
    "Terapagos": 1024,
    "Terapagos Terastal Form": 10276,
    "Terapagos Stellar Form": 10277,
    "Pecharunt": 1025,
}


@app.route('/')
def index():
    pokemon2 = pypokedex.get(name="Miraidon")
    return render_template('index.html', pokemon=pokemon2)

@app.route('/trigger_function', methods=['POST'])
def trigger_function():
    print("ekans")
    return render_template('index.html', pokemon=pypokedex.get(name="Ekans"))



if __name__ == '__main__':
    app.run(debug=True)
