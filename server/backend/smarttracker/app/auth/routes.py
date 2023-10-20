from app.auth import bp_auth
from flask import request
from app.auth.auth import auth_authenticate, auth_authenticated

@bp_auth.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username or not password:
        return { 'error': 'Missing credentials' }, 401
    try:
        return auth_authenticate(username, password)
    except Exception as e:
        return { 'error': str(e) }, 401
    
@bp_auth.route('/logout', methods=['GET'])
@auth_authenticated
def authenticated_route(username):
    return { 'message': f'Hello, {username}' }, 200