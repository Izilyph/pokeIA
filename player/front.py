from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/playIa', methods=['POST'])
def playIa():
    data = request.json['data2']
    print(data['possibilities']['move'])
    print(data['possibilities']['switch'])
    move = f">p2 {random.choice(convert_actions(data['possibilities']))}"
    response_data = {'move': move}
    return jsonify(response_data)

def convert_actions(action_space):
    converted_actions = []
    for a in action_space["move"]:
        converted_actions.append("move " + a)
    for a in action_space["switch"]:
        converted_actions.append("switch " + a)
    return converted_actions

if __name__ == '__main__':
    app.run(debug=True)