from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from database import db
from routes.auth_routes import auth_bp
from routes.job_routes import job_bp

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = 'supersecretkey123'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://peter:any@localhost:5432/synchub_new'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # ------------------------
    # Initialize extensions
    # ------------------------
    db.init_app(app)
    CORS(
        app,
        resources={r"/api/*": {"origins": "http://localhost:5173"}},
        supports_credentials=True  # ✅ allow cookies / credentials
    )

    # ------------------------
    # Register blueprints
    # ------------------------
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(job_bp, url_prefix="/api/jobs")

    return app

# ------------------------
# SocketIO
# ------------------------
app = create_app()
socketio = SocketIO(app, cors_allowed_origins="http://localhost:5173", manage_session=True)

@socketio.on("connect")
def handle_connect():
    print("✅ A client connected to SocketIO")

@socketio.on("disconnect")
def handle_disconnect():
    print("❌ A client disconnected from SocketIO")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
