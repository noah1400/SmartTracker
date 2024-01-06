from app.auth import bp_auth
from flask import Flask, request, jsonify, make_response
from app.auth.auth import auth
from werkzeug.exceptions import Unauthorized

@bp_auth.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    try:
        auth_result = auth.auth_authenticate(username, password)
        # Create response object
        response = make_response(jsonify({'username': auth_result['username'], 'id': auth_result['id'], 'token': auth_result['token']}))
        # Set the JWT in HTTP-only cookie
        response.set_cookie('token', auth_result['token'], httponly=True)
        return response
    except Unauthorized as e:  # Catch specific unauthorized exception
        return jsonify({'error': str(e)}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@bp_auth.route('/logout', methods=['GET'])
@auth.auth_authenticated
def authenticated_route(username):
    return { 'message': f'Hello, {username}' }, 200

@bp_auth.route('/status', methods=['GET'])
@auth.auth_authentication_check
def authenticated_check_route(authenticated):
    if authenticated:
        return jsonify({'authenticated': True}), 200
    else:
        return jsonify({'authenticated': False}), 401