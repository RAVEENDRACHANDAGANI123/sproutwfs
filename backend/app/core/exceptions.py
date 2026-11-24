from fastapi import HTTPException, status


class SproutBaseException(HTTPException):
    """Base domain exception for SproutWFS HR."""
    def __init__(self, detail: str, status_code: int = status.HTTP_400_BAD_REQUEST):
        super().__init__(status_code=status_code, detail=detail)


class ResourceNotFoundException(SproutBaseException):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            detail=f"{resource} identified by '{identifier}' was not found.",
            status_code=status.HTTP_404_NOT_FOUND
        )


class UnauthorizedException(SproutBaseException):
    def __init__(self, detail: str = "Invalid authentication credentials."):
        super().__init__(detail=detail, status_code=status.HTTP_401_UNAUTHORIZED)


class ForbiddenException(SproutBaseException):
    def __init__(self, detail: str = "Insufficient permissions to perform this action."):
        super().__init__(detail=detail, status_code=status.HTTP_403_FORBIDDEN)
