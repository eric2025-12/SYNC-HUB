from app import create_app
from flask_socketio import SocketIO

# Create Flask app
app = create_app()

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Optional: Example event for testing real-time connections
@socketio.on("connect")
def handle_connect():
    print("✅ A client connected to SocketIO")

@socketio.on("disconnect")
def handle_disconnect():
    print("❌ A client disconnected from SocketIO")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
