# routes/job_routes.py
from flask import Blueprint, request, jsonify
from utils.auth_utils import token_required
from database import db
from models.job import Job
from models.user import User
from datetime import datetime

job_bp = Blueprint('job_bp', __name__)

@job_bp.route('/post', methods=['POST'])
@token_required
def post_job(current_user):
    if current_user.role != 'client':
        return jsonify({"message": "Only clients can post jobs"}), 403
    data = request.get_json() or {}
    required = ['title', 'description']
    for r in required:
        if r not in data:
            return jsonify({"message": f"{r} is required"}), 400
    deadline = None
    if data.get('deadline'):
        try:
            deadline = datetime.fromisoformat(data['deadline'])
        except Exception:
            deadline = None
    job = Job(
        title=data['title'],
        description=data['description'],
        category=data.get('category'),
        budget=float(data.get('budget', 0)),
        deadline=deadline,
        client_id=current_user.id
    )
    db.session.add(job)
    db.session.commit()
    return jsonify({"message": "Job posted", "job": job.to_dict()}), 201

# ... rest of the job routes unchanged (list, job_details, apply_for_job, invite_developer, respond_invite, complete_job, approve_job)
