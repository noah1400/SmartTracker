from abc import ABC, abstractmethod

class AuthService(ABC):

    name = 'auth'
    config = {}

    """
    @param username: The username of the user
    @param password: The password of the user
    @return: The username if the user exists, None otherwise
    """
    @abstractmethod
    @classmethod
    def getUser(self, username, password, config = {}) -> str | None:
        pass