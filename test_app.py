from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Test app is working!'}), 200

@app.route('/api/test', methods=['GET'])
def test():
    return jsonify({'message': 'API test endpoint working!'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 