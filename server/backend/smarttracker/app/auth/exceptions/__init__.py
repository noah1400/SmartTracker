

class AuthenticationError(Exception):
    """Base class for exceptions in this module."""
    pass

class InvalidCredentials(AuthenticationError):
    """Raised when the credentials are invalid."""
    pass

class UnregisteredService(AuthenticationError):
    """Raised when the service for a registered user is not registered."""
    pass