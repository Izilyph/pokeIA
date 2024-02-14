from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/playIa', methods=['POST'])
def playIa():
    data = request.json
    print(data['data2']['possibilities']['move'])
    print(data['data2']['possibilities']['switch'])
    if data['data2']['possibilities']['move']:
        move = ">p2 move " + data['data2']['possibilities']['move'][0]
    else:
        move = ">p2 switch " + data['data2']['possibilities']['switch'][0]
    response_data = {'move': move}
    return jsonify(response_data)


if __name__ == '__main__':
    app.run(debug=True)