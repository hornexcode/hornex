class BaseAPIException(Exception):
    """Base class for API-related exceptions."""

    code: int

    def __init__(self, message):
        super().__init__(message)
        self.detail = message


class UnkownError(BaseAPIException):
    """Raised when an unknown error occurs."""

    code = 500


class BadRequest(BaseAPIException):
    """Raised when a bad request is made."""

    code = 400
