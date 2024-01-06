import os
import jwt
import datetime
import logging
from functools import wraps
from flask import request
from app.db import db
from app.db.models.User import User
from app.auth.services.keycloak_auth import KeyCloakService
from app.auth.exceptions import InvalidCredentials, UnregisteredService, InvalidToken, ExpiredToken
from werkzeug.exceptions import BadRequest

class AuthConfig:
    """Class to manage auth service configurations."""
    @staticmethod
    def load_services():
        """Load services configuration from environment or external file."""
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

class Auth:
    """
    Auth class to handle authentication and user management.
    Implements Singleton pattern to ensure only one instance.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Auth, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        self._user = None
        self.services = AuthConfig.load_services()

    def auth_authentication_check(self, f):
        """Decorator to check if user is authenticated."""
        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                auth_method, token = self._extract_token()
                if auth_method == 'oauth':
                    provider = self._get_provider_from_request(request)
                    self.validate_oauth_token(token, provider)
                else:
                    self._validate_token(token)
                return f(True, *args, **kwargs)
            except Exception as e:
                logging.error(f'Authentication error: {e}')
                # log traceback
                logging.error(e, exc_info=True)
                return f(False, *args, **kwargs)
            
        return decorated
            
    def auth_authenticated(self, f):
        """Decorator to authenticate API requests."""
        @wraps(f)
        def decorated(*args, **kwargs):
            try:
                auth_method, token = self._extract_token()
                logging.info(f'Authenticating token: {token}')
                if auth_method == 'oauth':
                    provider = self._get_provider_from_request(request)
                    user = self.validate_oauth_token(token, provider)
                    self._user = user
                    return f(self._user, *args, **kwargs)
                username = self._validate_token(token)
                self._user = self._get_user_by_username(username)
                return f(self._user, *args, **kwargs)
            except Exception as e:
                logging.error(f'Authentication error: {e}')
                # log traceback
                logging.error(e, exc_info=True)
                return {'error': str(e)}, 401

        return decorated

    def _get_provider_from_request(self, request):
        """Get the current provider from the request."""
        provider = request.headers.get('Provider')
        if not provider:
            raise UnregisteredService("Provider header is missing")
        return provider

    def _extract_token(self):
        """Extract token from the Authorization header or cookies."""
        # Try extracting from the Authorization header
        auth_header = request.headers.get('Authorization')
        if auth_header:
            parts = auth_header.split()
            if parts[0].lower() != 'bearer':
                raise BadRequest("Invalid Authorization header format")

            if len(parts) == 2:
                return 'internal', parts[1]
            elif len(parts) == 3 and parts[1].lower() == 'oauth':
                return 'oauth', parts[2]
            else:
                raise BadRequest("Invalid Authorization header format")

        # Try extracting from cookies if Authorization header is not present
        token = request.cookies.get('token')
        if token:
            return 'internal', token

        # Token not found in both Authorization header and cookies
        raise BadRequest("Authorization token is missing")
    
    def _validate_token(self, token):
        """Validate the extracted token."""
        try:
            payload = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            raise ExpiredToken('Signature expired. Please log in again.')
        except jwt.InvalidTokenError:
            raise InvalidToken('Invalid token. Please log in again.')

    def _get_user_by_username(self, username):
        """Retrieve user by username."""
        return User.query.filter_by(username=username).first()

    def validate_oauth_token(self, oauth_token, provider):
        """Validate OAuth token."""
        try:
            service = self.services.get(provider)
            if not service:
                raise UnregisteredService(f'Service {provider} not registered')

            user_info = service['service'].validateToken(oauth_token, service['config'])


            return self.upsert_user(user_info)
        except Exception as e:
            logging.error(f'OAuth token validation error: {e}')
            raise

    def generate_jwt(self, username) -> str:
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

    def decode_jwt(self, token) -> str:
        """Decode JWT token."""
        try:
            payload = jwt.decode(token, os.environ.get('SECRET_KEY'), algorithms=['HS256'])
            return payload['sub']
        except jwt.ExpiredSignatureError:
            raise ExpiredToken('Signature expired. Please log in again.')
        except jwt.InvalidTokenError:
            raise InvalidToken('Invalid token. Please log in again.')

    def check_internal(self, username: str, password: str) -> User | None:
        """Check internal user credentials."""
        user = User.query.filter_by(username=username).first()
        if user and user.service == "internal" and user.check_password(password):
            return user
        return None
      
    def upsert_user(self, user_info):
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
            new_user = User.create_with_role(**user_info)
            db.session.add(new_user)
            db.session.commit()
            return new_user

    def auth_authenticate(self, username: str, password: str) -> dict:
        """Authenticate user and generate token."""
        user = self.check_internal(username, password)
        if user:
            self._user = user
            token = self.generate_jwt(user.username)
            return {'username': user.username, 'id': user.id, 'token': token}
        raise InvalidCredentials('Invalid credentials')

    @property
    def user(self):
        """Get the current user."""
        return self._user

auth = Auth()
