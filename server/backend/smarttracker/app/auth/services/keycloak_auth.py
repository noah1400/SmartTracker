from app.auth.services import AuthService
from app.db.models import User
from keycloak import KeycloakOpenID
import logging

class KeyCloakService(AuthService):
    name = 'keycloak'

    @classmethod
    def getUser(self, username, password, config = {}) -> User | None:

        try:
            keycloak_openid = KeycloakOpenID(server_url=config['url'],
                                                client_id=config['client_id'],
                                                realm_name=config['realm'],
                                                client_secret_key=config['client_secret'])
            
            config_well_known = keycloak_openid.well_known()
            token = keycloak_openid.token(username, password)

            userinfo = keycloak_openid.userinfo(token['access_token'])


            return User(userinfo['preferred_username'], userinfo['email'], '', 'keycloak')
        except Exception as e:
            logging.error(e)
            return None
