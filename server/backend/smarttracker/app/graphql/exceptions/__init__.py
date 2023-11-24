
class GraphQLAPIException(Exception):
    def __init__(self, message, code):
        super().__init__(message)
        self.code = code

class NotFound(GraphQLAPIException):
    def __init__(self, message):
        super().__init__(message, 404)