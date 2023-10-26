from app.auth.services import AuthService
from app.db.models import User
import os

class KeyCloakService(AuthService):
    name = 'keycloak'

    @classmethod
    def getUser(self, username, password, config = {}) -> User | None:
        return User(username, '', '', 'keycloak')
