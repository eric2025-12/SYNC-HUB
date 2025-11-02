# utils/auth_utils.py
import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from models.user import User

JWT_SECRET = os.getenv("JWT_SECRET", "jwt-secret")
JWT_ALGORITHM = "HS256"

def generate_token(user_id, expires_hours=24):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=expires_hours)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    # jwt.encode may return bytes in some versions — ensure str
    if isinstance(token, bytes):
        token = token.decode('utf-8')
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            # Expect header: Authorization: Bearer <token>
            parts = request.headers['Authorization'].split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        if not token:
            return jsonify({"message": "Token is missing!"}), 401
        try:
            data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            current_user = User.query.get(data.get('user_id'))
            if not current_user:
                return jsonify({"message": "User not found"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token is invalid"}), 401
        except Exception:
            # generic fallback without exposing internal exception text
            return jsonify({"message": "Token validation failed"}), 401
        return f(current_user, *args, **kwargs)
    return decorated
