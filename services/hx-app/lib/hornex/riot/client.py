from typing import List, Dict, Union, Optional
from abc import ABC, abstractmethod


# Tournament regions: BR, EUNE, EUW, JP, LAN, LAS, NA, OCE, PBE, RU, TR


# Interface to the Riot API
# https://developer.riotgames.com/apis#tournament-v4
class Clientable(ABC):
    def __init__(self, api_key: str) -> None:
        self.api_key = api_key
        # In reality, you'd have authentication and connection setup here

    @abstractmethod
    def register_tournament_provider(self, url: str, region: str) -> int:
        """
        Register the tournament provider

        POST /lol/tournament/v4/providers
        {
            "url": "https://example.com",
            "region": "NA"
        }
        """
        pass

    @abstractmethod
    def register_tournament(self, name: str, provider_id: int) -> int:
        """
        Register the tournament and returns providerID

        POST /lol/tournament/v4/tournaments
        {
            "name": "Example Tournament",
            "providerId": 0
        }
        """
        pass

    @abstractmethod
    def get_tournament_codes(
        self,
        tournament_id: int,
        count: int,
        team_size: int,
        allowed_summoner_ids: List[str],
    ) -> List[str]:
        """
        Returns tournament codes

        POST /lol/tournament/v4/codes
        {
            "allowedSummonerIds": [
                "string"
            ],
            "mapType": "",
            "metadata": "",
            "pickType": "",
            "spectatorType": "",
            "teamSize": 0
        }
        """
        pass

    @abstractmethod
    def get_match_data_by_tournament_code(self, tournament_code: str) -> Dict:
        """
        Get match data by tournament code in case notification is missing
        Returns game results including MatchID

        GET /lol/match/v4/matches/by-tournament-code/{tournamentCode}/ids
        """
        pass

    @abstractmethod
    def get_lobby_events_by_tournament_code(self, tournament_code: str) -> Dict:
        """
        Return lobby data by tournament code

        GET /lol/tournament/v4/lobby-events/by-code/{tournamentCode}
        """
        pass


# Move this to test folder
class TestApi(Clientable):
    def register_tournament_provider(self, url: str, region: str) -> int:
        return 0

    def register_tournament(self, name: str, provider_id: int) -> int:
        return 0

    def get_tournament_codes(
        self,
        tournament_id: int,
        count: int,
        team_size: int,
        allowed_summoner_ids: List[str],
    ) -> List[str]:
        return []

    def get_match_data_by_tournament_code(self, tournament_code: str) -> Dict:
        return {}

    def get_lobby_events_by_tournament_code(self, tournament_code: str) -> Dict:
        return {}


def getApi(api_key: str) -> Clientable:
    return TestApi(api_key)
