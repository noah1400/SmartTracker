

class AuthenticationError(Exception):
    """Base class for exceptions in this module."""
    def __init__(self, message):
        super().__init__(message)
        self.message = message
    pass

class InvalidCredentials(AuthenticationError):
    """Raised when the credentials are invalid."""
    pass

class UnregisteredService(AuthenticationError):
    """Raised when the service for a registered user is not registered."""
    pass

class InvalidToken(AuthenticationError):
    """Raised when the token is invalid."""
    pass

class ExpiredToken(AuthenticationError):
    """Raised when the token is expired."""
    pass

class Unauthorized(AuthenticationError):
    """Raised when the user is not authorized to perform an action."""
    pass