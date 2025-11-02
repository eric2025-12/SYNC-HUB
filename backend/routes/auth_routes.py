from flask import Blueprint, request, jsonify
from database import db
from models.user import User
from utils.auth_utils import generate_token
from sqlalchemy.exc import SQLAlchemyError

auth_bp = Blueprint("auth_bp", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    required_fields = ["name", "email", "password", "role"]

    # Validate required fields
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"error": f"'{field}' is required"}), 400

    try:
        # Check if email already exists
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 400

        # Create user
        user = User(
            name=data["name"],
            email=data["email"],
            role=data["role"],
            bio=data.get("bio", ""),
            skills=",".join(data.get("skills", [])) if isinstance(data.get("skills", []), list) else data.get("skills", "")
        )
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()

        token = generate_token(user.id)

        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": user.to_dict()
        }), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Database error occurred during registration",
            "details": str(e)
        }), 500

    except Exception as e:
        return jsonify({
            "error": "Unexpected error during registration",
            "details": str(e)
        }), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    try:
        user = User.query.filter_by(email=data["email"]).first()

        if not user or not user.check_password(data["password"]):
            return jsonify({"error": "Invalid email or password"}), 401

        token = generate_token(user.id)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": user.to_dict()
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Unexpected error during login",
            "details": str(e)
        }), 500
