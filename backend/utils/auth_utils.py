import jwt
from functools import wraps
from flask import request, jsonify
from datetime import datetime, timedelta
from database import db
from models.user import User

# Secret key for JWT (should match your app config)
SECRET_KEY = "supersecretkey123"
TOKEN_EXPIRATION_HOURS = 24  # Token valid for 24 hours

def generate_token(user_id):
    """
    Generates JWT token for a given user ID
    """
    try:
        payload = {
            "user_id": user_id,
            "exp": datetime.utcnow() + timedelta(hours=TOKEN_EXPIRATION_HOURS)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        # PyJWT >=2.0 returns string, <=1.7 returns bytes
        if isinstance(token, bytes):
            token = token.decode("utf-8")
        return token
    except Exception as e:
        print("Error generating token:", e)
        return None

def token_required(f):
    """
    Decorator to protect routes that require authentication
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # JWT passed in headers
        if "Authorization" in request.headers:
            token = request.headers.get("Authorization").split(" ")[-1]

        if not token:
            return jsonify({"error": "Token is missing"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"error": "User not found"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            print("Unexpected error decoding token:", e)
            return jsonify({"error": "Token validation failed"}), 401

        return f(current_user, *args, **kwargs)

    return decorated
