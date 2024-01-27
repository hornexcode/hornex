import os

api_key: str = os.getenv("CHALLONGE_API_KEY", "")

from lib.challonge._tournament import (
    Tournament as Tournament,
)

__all__ = ["api_key", "Tournament"]
