# routes/user_routes.py
from flask import Blueprint, request, jsonify
from utils.auth_utils import token_required
from database import db
from models.user import User

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/me', methods=['GET'])
@token_required
def get_me(current_user):
    return jsonify({"user": current_user.to_dict()})

@user_bp.route('/update', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json() or {}
    # Allow updating simple fields
    current_user.name = data.get('name', current_user.name)
    current_user.bio = data.get('bio', current_user.bio)
    # If skills provided as list -> convert to CSV; if provided as string, keep it
    skills_val = data.get('skills')
    if isinstance(skills_val, list):
        current_user.skills = ",".join(skills_val)
    elif isinstance(skills_val, str):
        current_user.skills = skills_val
    # else keep existing
    current_user.portfolio_url = data.get('portfolio_url', current_user.portfolio_url)
    current_user.active = data.get('active', current_user.active)
    db.session.commit()
    return jsonify({"message": "Profile updated", "user": current_user.to_dict()})

@user_bp.route('/list_developers', methods=['GET'])
def list_developers():
    # Public endpoint listing developers (with simple filters)
    skill = request.args.get('skill')
    query = User.query.filter_by(role='developer')
    if skill:
        query = query.filter(User.skills.ilike(f"%{skill}%"))
    devs = [d.to_dict() for d in query.limit(100).all()]
    return jsonify({"developers": devs})
