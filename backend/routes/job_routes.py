from flask import Blueprint, request, jsonify
from utils.auth_utils import token_required
from database import db
from models.job import Job
from models.user import User
from datetime import datetime

job_bp = Blueprint("job_bp", __name__)

# ------------------------
# Post a Job
# ------------------------
@job_bp.route("/post", methods=["POST"])
@token_required
def post_job(current_user):
    if current_user.role != "client":
        return jsonify({"message": "Only clients can post jobs"}), 403

    data = request.get_json() or {}
    required = ["title", "description"]
    for r in required:
        if r not in data:
            return jsonify({"message": f"{r} is required"}), 400

    deadline = None
    if data.get("deadline"):
        try:
            deadline = datetime.fromisoformat(data["deadline"])
        except Exception:
            deadline = None

    job = Job(
        title=data["title"],
        description=data["description"],
        client_id=current_user.id,
        status="available"
    )

    db.session.add(job)
    db.session.commit()

    return jsonify({"message": "Job posted", "job": job.to_dict()}), 201

# ------------------------
# List Jobs
# ------------------------
@job_bp.route("/list", methods=["GET"])
@token_required
def list_jobs(current_user):
    status_filter = request.args.get("status", "available").lower()
    try:
        if status_filter not in ["available", "in_progress", "completed"]:
            return jsonify({"error": "Invalid job status"}), 400

        jobs = Job.query.filter_by(status=status_filter).all()
        jobs_data = [job.to_dict() for job in jobs]

        return jsonify({"jobs": jobs_data, "count": len(jobs_data)}), 200

    except Exception as e:
        print("Error listing jobs:", e)
        return jsonify({"error": "Failed to list jobs", "details": str(e)}), 500
