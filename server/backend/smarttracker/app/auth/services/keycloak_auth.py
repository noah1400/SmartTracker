from app.auth.services import AuthService
import os

class KeyCloakService(AuthService):
    name = 'keycloak'

    def getUser(self, username, password) -> str | None:
        pass
