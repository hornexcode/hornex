# https://developer.riotgames.com/docs/lol#tournament-api_best-practices
from lib.hornex.riot import Clientable
from enum import Enum
from requests import RequestException


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


class RegisterTeam:
    def __init__(self, api: Clientable):
        self.api = api

    def execute(self, name: str, region: str) -> int:
        try:
            provider_id = self.api.register_tournament_provider(
                "https://example.com/callback", region
            )
            tournament_id = self.api.create_tournament(provider_id, name, region)
            return tournament_id
        except RequestException as e:
            print(e)  # Connection Error, 404, 500, etc
            return
        except Exception as e:
            print(e)  # Unkown error
            return
