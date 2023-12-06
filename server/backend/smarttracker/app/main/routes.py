from app.main import bp
from flask import jsonify
from app.auth.auth import auth

@bp.route('/ping', methods=['GET'])
def ping():
    return jsonify('pong')

@bp.route('/protected-ping', methods=['GET'])
@auth.auth_authenticated
def protected_ping(username):
    return jsonify('protected pong')