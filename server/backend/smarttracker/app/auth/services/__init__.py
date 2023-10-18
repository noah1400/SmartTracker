from abc import ABC, abstractmethod

class AuthService(ABC):

    name = 'auth'
    config = {}

    def __init__(self, config):
        self.config = config

    """
    @param username: The username of the user
    @param password: The password of the user
    @return: The username if the user exists, None otherwise
    """
    @abstractmethod
    def getUser(self, username, password) -> str | None:
        pass