# models/job.py
from database import db
from datetime import datetime

class Job(db.Model):
    __tablename__ = 'jobs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=True)
    budget = db.Column(db.Float, nullable=True)
    deadline = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(50), default='available')  # available, taken, in_progress, completed
    client_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    developer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    client = db.relationship('User', foreign_keys=[client_id], backref='posted_jobs')
    developer = db.relationship('User', foreign_keys=[developer_id], backref='accepted_jobs')

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "category": self.category,
            "budget": self.budget,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "status": self.status,
            "client_id": self.client_id,
            "developer_id": self.developer_id,
            "created_at": self.created_at.isoformat()
        }

