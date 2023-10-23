from app.auth.services.keycloak_auth import KeyCloakService
from app.auth.exceptions import InvalidCredentials, UnregisteredService, InvalidToken, ExpiredToken
import jwt, datetime
from app.db import db
from app.db.models import User
from flask import request
from functools import wraps
import os

services = {
    'keycloak': {
        'name': 'keycloak',
        'config': {
            'url': os.environ.get('KEYCLOAK_URL'),
            'realm': os.environ.get('KEYCLOAK_REALM'),
            'client_id': os.environ.get('KEYCLOAK_CLIENT_ID'),
            'client_secret': os.environ.get('KEYCLOAK_CLIENT_SECRET')
        },
        'service': KeyCloakService,
    }
}

def auth_authenticated(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            token = request.headers.get('Authorization')
            if token:
                token = token.split(' ')[1] # Bearer <token>
                username = auth_decodeJWT(token)
                if username:
                    return f(username, *args, **kwargs)
        except Exception as e:
            return { 'error': str(e) }, 401
        return { 'error': 'Missing Token' }, 401
    return decorated


def auth_generateJWT(username):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=30),
            'iat': datetime.datetime.utcnow(),
            'sub': username
        }
        return jwt.encode(
            payload,
            os.environ.get('SECRET_KEY'),
            algorithm='HS256'
        )
    except Exception as e:
        return e


def auth_decodeJWT(token):
    try:
        payload = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        raise ExpiredToken('Signature expired. Please log in again.')
    except jwt.InvalidTokenError:
        raise InvalidToken('Invalid token. Please log in again.')


def auth_checkInternal(username, password):
    user = User.query.filter_by(username=username).first()
    if user:
        if user.service == "internal" and user.check_password(password):
            return username
        service = services[user.service]
        if not service:
            raise UnregisteredService(f'Service {user.service} not registered')
        user = service['service'].getUser(username, password, service['config'])
        if user:
            return username
    return None

def auth_authenticate(username, password):
    user = auth_checkInternal(username, password)
    if user:
        return { 'username': user, 'token': auth_generateJWT(user) }
    for service in services.values():
        user = service['service'].getUser(username, password, service['config'])
        if user:
            return { 'username': user, 'service': service['name'], 'token': auth_generateJWT(user) }
    raise InvalidCredentials('Invalid credentials')
