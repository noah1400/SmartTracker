from app.auth.services import AuthService
from app.db.models import User
from keycloak import KeycloakOpenID
import logging

class KeyCloakService(AuthService):
    name = 'keycloak'

    @classmethod
    def validateToken(self, token, config = {}) -> User | None:

        try:
            keycloak_openid = KeycloakOpenID(server_url=config['url'],
                                                client_id=config['client_id'],
                                                realm_name=config['realm'],
                                                client_secret_key=config['client_secret'])

            userinfo = keycloak_openid.userinfo(token)


            return User(userinfo['preferred_username'], userinfo['email'], '', 'keycloak')
        except Exception as e:
            logging.error(e)
            return None
