from app.auth.services.keycloak_auth import KeyCloakService
from app.auth.exceptions import InvalidCredentials, UnregisteredService, InvalidToken, ExpiredToken
import jwt, datetime
from app.db import db
from app.db.models import User
from flask import request
from functools import wraps
import os



class Auth():
    
    _instance = None

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

    def __new__(cls):
        if not cls._instance:
            cls._instance = super(Auth, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        self._user = None

    def auth_authenticated(self, f):
        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                token = request.headers.get('Authorization')
                if token:
                    token = token.split(' ')[1] # Bearer <token>
                    username = self.auth_decodeJWT(token)
                    self._user = User.query.filter_by(username=username).first()
                    if username:
                        return f(username, *args, **kwargs)
            except Exception as e:
                return { 'error': str(e) }, 401
            return { 'error': 'Missing Token' }, 401
        return decorated
    
    def auth_generateJWT(self, username) -> str:
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
        
    def auth_decodeJWT(self, token) -> str:
        try:
            payload = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            raise ExpiredToken('Signature expired. Please log in again.')
        except jwt.InvalidTokenError:
            raise InvalidToken('Invalid token. Please log in again.')


    def auth_checkInternal(self, username: str, password: str) -> User | None:
        user = User.query.filter_by(username=username).first()
        if user:
            if user.service == "internal" and user.check_password(password):
                return user
            service = self.services[user.service]
            if not service:
                raise UnregisteredService(f'Service {user.service} not registered')
            user = service['service'].getUser(username, password, service['config'])
            if user:
                return user
        return None
    
    def auth_upsertUser(self, user: User):
        existing_user = User.query.filter_by(username=user.username).first()
        if existing_user:
            existing_user.username = user.username
            existing_user.email = user.email
            existing_user.password_hash = user.password_hash
            existing_user.service = user.service
            existing_user.role_id = user.role_id
            existing_user.created_at = user.created_at
            existing_user.updated_at = user.updated_at
            db.session.commit()
            return existing_user
        else:
            new_user = User.create_with_role(user.username, user.email, user.password_hash, user.service, 'user')
            return new_user



    def auth_authenticate(self, username: str, password: str) -> dict:
        user = self.auth_checkInternal(username, password)
        if user:
            self._user = user
            return { 'username': user.username, 'service': user.service, 'token': self.auth_generateJWT(user.username) }
        for service in self.services.values():
            user = service['service'].getUser(username, password, service['config'])
            if user:
                self._user = self.auth_upsertUser(user)
                return { 'username': user.username, 'service': service['name'], 'token': self.auth_generateJWT(user.username) }
        raise InvalidCredentials('Invalid credentials')
    
    @property
    def user(self) -> User:
        return self._user
    
auth = Auth()

