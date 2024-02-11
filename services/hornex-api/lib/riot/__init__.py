import os

api_key = os.getenv("RIOT_API_KEY")

from lib.riot._tournament import Tournament  # noqa
from lib.riot._provider import Provider  # noqa
from lib.riot._summoner_v4 import Summoner  # noqa
from lib.riot._league_v4 import LeagueV4  # noqa

__all__ = ["Tournament", "Provider", "Summoner", "LeagueV4"]
