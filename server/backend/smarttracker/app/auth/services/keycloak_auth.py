from app.auth.services import AuthService
from app.db.models import User
import requests
import logging
import jwt
from jwt import DecodeError, ExpiredSignatureError, InvalidAudienceError, InvalidIssuerError, InvalidKeyError, InvalidSignatureError, PyJWKClient, PyJWKClientError
import random
import string

from app.auth.exceptions import ExpiredToken, InvalidToken

class KeyCloakService(AuthService):
    name = 'keycloak'

    @classmethod
    def validateToken(cls, access_token, config=None) -> dict | None:
        if config is None:
            config = {}
        try:
            audience = config.get('audience', 'account')  # Default audience set to 'account'
            if not all(k in config for k in ['url', 'realm']):
                raise ValueError("Config must contain 'url' and 'realm' keys")

            well_known_url = f"{config['url']}/realms/{config['realm']}/.well-known/openid-configuration"
            well_known = requests.get(well_known_url).json()
            jwk_url = well_known['jwks_uri']
            signing_algos = well_known.get('id_token_signing_alg_values_supported', ['RS256'])

            jwks_client = PyJWKClient(jwk_url)
            signing_key = jwks_client.get_signing_key_from_jwt(access_token)
            data = jwt.decode(access_token, signing_key.key, algorithms=signing_algos, audience=audience)

            # Generate a random password ( security not relevant, as the password isn't used because of oauth )
            # This is needed to create a user in the database, and prevent null errors
            pw = ''.join(random.choices(string.ascii_letters + string.digits, k=20))

            user_info = {
                'username': data['preferred_username'],
                'email': data['email'],
                'password': pw,
                'service': cls.name
            }

            return user_info
            
        except ExpiredSignatureError:
            logging.error("Token has expired")
            raise ExpiredToken("Token has expired")
        except InvalidSignatureError:
            logging.error("Invalid token signature")
            raise InvalidToken("Invalid token signature")
        except DecodeError:
            logging.error("Error decoding token")
            raise InvalidToken("Error decoding token")
        except InvalidAudienceError:
            logging.error("Invalid audience in token")
            raise InvalidToken("Invalid audience in token")
        except InvalidIssuerError:
            logging.error("Invalid issuer")
            raise InvalidToken("Invalid issuer")
        except InvalidKeyError:
            logging.error("Invalid key")
            raise InvalidToken("Invalid key")
        except PyJWKClientError:
            logging.error("Error with PyJWKClient")
            raise InvalidToken("Error with PyJWKClient")
        except requests.RequestException as e:
            logging.error(f"Error fetching well-known configuration or JWKS: {e}")
            raise InvalidToken(f"Error fetching well-known configuration or JWKS: {e}")
        except Exception as e:
            logging.error("Unexpected error in token validation")
            logging.exception(e)
            raise InvalidToken("Unexpected error in token validation")