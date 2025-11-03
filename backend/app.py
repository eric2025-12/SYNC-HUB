from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_socketio import SocketIO
from config import Config
from database import db

# Initialize SocketIO globally
socketio = SocketIO(cors_allowed_origins="*")  # Allow all origins for frontend connections


def create_app():
    app = Flask(__name__, instance_relative_config=True)

    # Load configurations
    app.config.from_object(Config)

    # Initialize Flask extensions
    db.init_app(app)
    JWTManager(app)
    Migrate(app, db)

    # Configure CORS for your frontend origin(s)
    # Replace "*" with your frontend URL in production
    CORS(app, origins=app.config.get("CORS_ORIGINS", "*"), supports_credentials=True)

    # Attach SocketIO to Flask app
    socketio.init_app(app, cors_allowed_origins="*")

    # Import and register blueprints
    from routes.auth_routes import auth_bp
    from routes.user_routes import user_bp
    from routes.job_routes import job_bp
    from routes.chat_routes import chat_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp, url_prefix="/api/users")
    app.register_blueprint(job_bp, url_prefix="/api/jobs")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")

    # Health check route
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({"message": "SYNC-HUB API is running successfully ✅"}), 200

    return app


# Only run when this file is executed directly
if __name__ == "__main__":
    app = create_app()

    # Start Flask + SocketIO server
    socketio.run(
        app,
        host="0.0.0.0",   # Accept requests from any host
        port=5000,
        debug=True
    )
