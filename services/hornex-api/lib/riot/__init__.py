import os

api_key = os.getenv("RIOT_API_KEY")

from lib.riot._tournament import Tournament  # noqa
from lib.riot._provider import Provider  # noqa

__all__ = ["Tournament", "Provider"]
