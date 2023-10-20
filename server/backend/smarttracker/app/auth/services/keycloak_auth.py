from app.auth.services import AuthService
import os

class KeyCloakService(AuthService):
    name = 'keycloak'

    @classmethod
    def getUser(self, username, password, config = {}) -> str | None:
        return username
