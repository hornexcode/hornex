import os

from lib.challonge._match import (
    Match as Match,
)
from lib.challonge._participant import (
    Participant as Participant,
)
from lib.challonge._tournament import (
    Tournament as Tournament,
)

api_key: str = os.getenv("CHALLONGE_API_KEY", "")

__all__ = ["api_key", "Tournament", "Match", "Participant"]
