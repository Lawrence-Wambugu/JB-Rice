# Import the Flask app from server directory
from server.app_simple import app

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000) 