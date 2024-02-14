from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/playIa', methods=['POST'])
def playIa():
    data = request.json['data2']
    print(data['possibilities']['move'])
    print(data['possibilities']['switch'])
    if data['possibilities']['move']:
        move = ">p2 move " + data['possibilities']['move'][0]
    else:
        move = ">p2 switch " + data['possibilities']['switch'][0]
    response_data = {'move': move}
    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True)