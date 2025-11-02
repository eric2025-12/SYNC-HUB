# socketio_server.py
# Basic SocketIO setup - used for realtime chat/notifications if you enable it.

from flask_socketio import SocketIO, emit, join_room, leave_room

# create SocketIO instance (cors allowed origins will also be set in app.init_app)
socketio = SocketIO(cors_allowed_origins="*")  # origin set by app init

# Socket event examples (optional)
@socketio.on('join')
def on_join(data):
    # data = {'room': 'task_1', 'user': 'dev1'}
    room = data.get('room')
    join_room(room)
    emit('status', {'msg': f"{data.get('user')} joined"}, room=room)

@socketio.on('leave')
def on_leave(data):
    room = data.get('room')
    leave_room(room)
    emit('status', {'msg': f"{data.get('user')} left"}, room=room)

@socketio.on('message')
def handle_message(data):
    # data = {'room': 'task_1', 'user': 'dev1', 'text': 'I completed step 1'}
    room = data.get('room')
    emit('message', data, room=room)
