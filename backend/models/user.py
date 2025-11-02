# models/user.py
from database import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.String(20), nullable=False)  # 'client' or 'developer'
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    bio = db.Column(db.Text, default="")
    skills = db.Column(db.String(256), default="")  # comma-separated
    portfolio_url = db.Column(db.String(255), nullable=True)
    wallet = db.Column(db.Float, default=0.0)  # simulated wallet
    active = db.Column(db.Boolean, default=True)  # profile active or not
    online = db.Column(db.Boolean, default=False)  # online presence
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, pw):
        self.password_hash = generate_password_hash(pw)

    def check_password(self, pw):
        return check_password_hash(self.password_hash, pw)

    def to_dict(self):
        return {
            "id": self.id,
            "role": self.role,
            "name": self.name,
            "email": self.email,
            "bio": self.bio,
            "skills": self.skills,
            "portfolio_url": self.portfolio_url,
            "wallet": self.wallet,
            "active": self.active,
            "online": self.online,
            "created_at": self.created_at.isoformat()
        }

