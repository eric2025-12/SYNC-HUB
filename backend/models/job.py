from database import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(50), default="available")  # available, in_progress, completed
    client_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    developer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    client = db.relationship("User", foreign_keys=[client_id], backref="posted_jobs")
    developer = db.relationship("User", foreign_keys=[developer_id], backref="assigned_jobs")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "client_id": self.client_id,
            "developer_id": self.developer_id,
            "created_at": self.created_at.isoformat()
        }
