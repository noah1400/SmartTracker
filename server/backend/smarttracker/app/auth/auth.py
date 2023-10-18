from app.auth.services.keycloak_auth import KeyCloakService
from app.auth.exceptions import InvalidCredentials, UnregisteredService
import jwt, datetime
from app.db import db
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


def auth_checkInternal(username, password):
    user = db.session.query(db.User).filter_by(username=username).first()
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
        return user
    for service in services.values():
        user = service['service'].getUser(username, password, service['config'])
        if user:
            return { 'username': user, 'service': service['name'], 'token': auth_generateJWT(user) }
    raise InvalidCredentials('Invalid credentials')
