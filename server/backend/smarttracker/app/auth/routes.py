from app.auth import bp_auth
from flask import request
from app.auth.auth import auth

@bp_auth.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    try:
        return auth.auth_authenticate(username, password)
    except Exception as e:
        return { 'error': str(e) }, 401
    
@bp_auth.route('/logout', methods=['GET'])
@auth.auth_authenticated
def authenticated_route(username):
    return { 'message': f'Hello, {username}' }, 200