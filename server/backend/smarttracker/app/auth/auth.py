import os
import jwt
import datetime
import logging
from functools import wraps
from flask import request
from app.db import db
from app.db.models import User
from app.auth.services.keycloak_auth import KeyCloakService
from app.auth.exceptions import InvalidCredentials, UnregisteredService, InvalidToken, ExpiredToken

class Auth:
    """
    Auth class to handle authentication and user management.
    Implements Singleton pattern to ensure only one instance.
    """

    _instance = None

    def __new__(cls):
        """Implement singleton pattern."""
        if cls._instance is None:
            cls._instance = super(Auth, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        self._user = None
        self.services = self._load_services()

    @staticmethod
    def _load_services():
        """Load services configuration."""
        return {
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

    def auth_authenticated(self, f):
        """Decorator to authenticate API requests."""
        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                token = self._extract_token(request)
                username = self._validate_token(token)
                self._user = self._get_user_by_username(username)
                return f(self._user, *args, **kwargs)
            except Exception as e:
                logging.error(f'Authentication error: {e}')
                return {'error': str(e)}, 401

        return decorated

    @staticmethod
    def _extract_token(request):
        """Extract token from the Authorization header."""
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            raise InvalidToken("Authorization header is missing")

        parts = auth_header.split()

        if parts[0] != 'Bearer' or len(parts) != 2:
            raise InvalidToken("Invalid Authorization header format")

        return parts[1]

    def _validate_token(self, token):
        """Validate the extracted token."""
        try:
            payload = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            raise ExpiredToken('Signature expired. Please log in again.')
        except jwt.InvalidTokenError:
            raise InvalidToken('Invalid token. Please log in again.')

    @staticmethod
    def _get_user_by_username(username):
        """Retrieve user by username."""
        return User.query.filter_by(username=username).first()

    def validate_oauth_token(self, oauth_token, provider):
        """Validate OAuth token."""
        try:
            service = self.services.get(provider)
            if not service:
                raise UnregisteredService(f'Service {provider} not registered')
            
            user_info = service['service'].validateToken(oauth_token, service['config'])
            return self.auth_upsertUser(user_info)
        except Exception as e:
            logging.error(f'OAuth token validation error: {e}')
            raise

    def auth_generateJWT(self, username) -> str:
        """Generate JWT token."""
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
            logging.error(f'JWT generation error: {e}')
            raise

    def auth_decodeJWT(self, token) -> str:
        """Decode JWT token."""
        try:
            payload = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            raise ExpiredToken('Signature expired. Please log in again.')
        except jwt.InvalidTokenError:
            raise InvalidToken('Invalid token. Please log in again.')

    def auth_checkInternal(self, username: str, password: str) -> User | None:
        """Check internal user credentials."""
        user = User.query.filter_by(username=username).first()
        if user and user.service == "internal" and user.check_password(password):
            return user
        return None
    
    def auth_upsertUser(self, user_info):
        """Upsert user information."""
        existing_user = User.query.filter_by(username=user_info['username']).first()
        if existing_user:
            # Update existing user
            for key, value in user_info.items():
                setattr(existing_user, key, value)
            db.session.commit()
            return existing_user
        else:
            # Create new user
            new_user = User(**user_info)
            db.session.add(new_user)
            db.session.commit()
            return new_user

    def auth_authenticate(self, username: str, password: str) -> dict:
        """Authenticate user and generate token."""
        user = self.auth_checkInternal(username, password)
        if user:
            self._user = user
            token = self.auth_generateJWT(user.username)
            return {'username': user.username, 'token': token}
        raise InvalidCredentials('Invalid credentials')

    @property
    def user(self):
        """Get the current user."""
        return self._user

auth = Auth()
