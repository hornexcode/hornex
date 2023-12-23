# https://developer.riotgames.com/docs/lol#tournament-api_best-practices
from enum import Enum

from requests import RequestException

from apps.tournaments.leagueoflegends.models import LeagueOfLegendsTournamentProvider
from lib.hornex.riot import Clientable


class Region(Enum):
    BR = "BR"
    EUNE = "EUNE"
    EUW = "EUW"
    JP = "JP"
    KR = "KR"
    LAN = "LAN"
    LAS = "LAS"
    NA = "NA"
    OCE = "OCE"
    TR = "TR"
    RU = "RU"


class RegisterTournamentProviderUseCase:
    def __init__(self, api: Clientable):
        self.api = api

    def execute(self, region: str) -> LeagueOfLegendsTournamentProvider:
        try:
            provider_id = self.api.register_tournament_provider(
                "https://example.com/callback", region
            )
            provider = LeagueOfLegendsTournamentProvider.objects.create(
                id=provider_id, region=region
            )
            return provider
        except RequestException as e:
            print(e)  # Connection Error, 404, 500, etc
            return
        except Exception as e:
            print(e)  # Unkown error
            return
