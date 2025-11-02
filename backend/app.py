from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_socketio import SocketIO
from config import Config
from database import db
import os


socketio = SocketIO(cors_allowed_origins="*")  # Enables real-time communication


def create_app():
    app = Flask(__name__, instance_relative_config=True)

    # Load configurations
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    JWTManager(app)
    Migrate(app, db)
    CORS(app, origins=app.config.get("CORS_ORIGINS", "*"))
    socketio.init_app(app)

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


# Only needed for running directly
if __name__ == "__main__":
    app = create_app()
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
