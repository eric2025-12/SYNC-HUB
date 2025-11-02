# routes/chat_routes.py
from flask import Blueprint, request, jsonify
from utils.auth_utils import token_required
from database import db
from models.message import Message

chat_bp = Blueprint('chat_bp', __name__)

@chat_bp.route('/send', methods=['POST'])
@token_required
def send_message(current_user):
    data = request.get_json()
    required = ['receiver_id', 'content']
    for r in required:
        if r not in data:
            return jsonify({"message": f"{r} is required"}), 400
    msg = Message(
        job_id=data.get('job_id'),
        sender_id=current_user.id,
        receiver_id=data['receiver_id'],
        content=data['content']
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify({"message": "Message sent", "msg": msg.to_dict()})

@chat_bp.route('/thread/<int:user_id>', methods=['GET'])
@token_required
def get_thread(current_user, user_id):
    # Return messages exchanged between current_user and user_id
    messages = Message.query.filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.timestamp.asc()).all()
    return jsonify({"messages": [m.to_dict() for m in messages]})

