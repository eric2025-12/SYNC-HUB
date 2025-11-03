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
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

    try:
        # Check if email already exists
        existing_user = User.query.filter_by(email=data["email"].strip().lower()).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 400

        # Normalize skills input
        skills = data.get("skills", [])
        if isinstance(skills, list):
            skills = ",".join(skills)
        elif not isinstance(skills, str):
            skills = ""

        # Create new user
        user = User(
            name=data["name"].strip(),
            email=data["email"].strip().lower(),
            role=data["role"].strip(),
            bio=data.get("bio", "").strip(),
            skills=skills
        )
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()

        # Generate JWT token
        token = generate_token(user.id)

        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": user.to_dict()
        }), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        print("Database error during registration:", e)
        return jsonify({
            "error": "Database error occurred during registration",
            "details": str(e)
        }), 500

    except Exception as e:
        print("Unexpected error during registration:", e)
        return jsonify({
            "error": "Unexpected error occurred during registration",
            "details": str(e)
        }), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    try:
        user = User.query.filter_by(email=data["email"].strip().lower()).first()

        if not user or not user.check_password(data["password"]):
            return jsonify({"error": "Invalid email or password"}), 401

        token = generate_token(user.id)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": user.to_dict()
        }), 200

    except SQLAlchemyError as e:
        print("Database error during login:", e)
        return jsonify({
            "error": "Database error occurred during login",
            "details": str(e)
        }), 500

    except Exception as e:
        print("Unexpected error during login:", e)
        return jsonify({
            "error": "Unexpected error occurred during login",
            "details": str(e)
        }), 500
