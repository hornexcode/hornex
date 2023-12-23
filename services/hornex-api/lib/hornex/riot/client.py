import random
import uuid
from abc import ABC, abstractmethod
from enum import Enum

from django.utils import timezone

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
        allowed_summoner_ids: list[str],
    ) -> list[str]:
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
    def get_match_data_by_tournament_code(self, tournament_code: str) -> dict:
        """
        Get match data by tournament code in case notification is missing
        Returns game results including MatchID

        GET /lol/match/v4/matches/by-tournament-code/{tournamentCode}/ids
        """
        pass

    @abstractmethod
    def get_lobby_events_by_tournament_code(self, tournament_code: str) -> list[dict]:
        """
        Return lobby data by tournament code

        GET /lol/tournament/v4/lobby-events/by-code/{tournamentCode}
        """
        pass

    @abstractmethod
    def get_a_summoner_by_summoner_name(self, name: str, region: str) -> dict:
        """
        Get a summoner by summoner name.

        GET /lol/summoner/v4/summoners/by-name/{summonerName}
        """
        pass

    @abstractmethod
    def get_league_by_summoner_id(self, id: str, region: str) -> list[dict]:
        """
        Get league entries in all queues for a given summoner ID.

        GET /lol/league/v4/entries/by-summoner/{encryptedSummonerId}
        """
        pass


class PickType(Enum):
    BLIND_PICK = "BLIND_PICK"
    DRAFT_MODE = "DRAFT_MODE"
    ALL_RANDOM = "ALL_RANDOM"
    TOURNAMENT_DRAFT = "TOURNAMENT_DRAFT"


class MapType(Enum):
    SUMMONERS_RIFT = "SUMMONERS_RIFT"
    TWISTED_TREELINE = "TWISTED_TREELINE"
    HOWLING_ABYSS = "HOWLING_ABYSS"


class SpectatorType(Enum):
    NONE = "NONE"
    LOBBYONLY = "LOBBYONLY"
    ALL = "ALL"


# Move this to test folder
class TestApi(Clientable):
    def register_tournament_provider(self, url: str, region: str) -> int:
        provider = random.randint(1, 99999)
        return provider

    def register_tournament(self, name: str, provider_id: int) -> int:
        provider = random.randint(1, 99999)
        return provider

    def get_tournament_codes(
        self,
        tournament_id: int,
        count: int,
        team_size: int,
        allowed_summoner_ids: list[str],
    ) -> list[str]:
        codes = []

        for i in range(count):
            codes.append(str(uuid.uuid4()))
            """ {
                "allowedSummonerIds": allowed_summoner_ids,
                "mapType": MapType.HOWLING_ABYSS,
                "metadata": "Dummy tournament code metadata",
                "pickType": PickType.BLIND_PICK,
                "spectatorType": SpectatorType.LOBBYONLY,
                "teamSize": team_size,
            } """

        return codes

    def get_match_data_by_tournament_code(self, tournament_code: str) -> dict:
        return {}

    def get_lobby_events_by_tournament_code(self, tournament_code: str) -> list[dict]:
        return [
            {
                "timestamp": str(timezone.now()),
                "eventType": "Dummy event type",
                "summonerId": uuid.uuid49,
            }
        ]

    def get_a_summoner_by_summoner_name(self, name: str, region: str) -> dict:
        return {
            "id": str(uuid.uuid4()),
            "accountId": str(uuid.uuid4()),
            "puuid": str(uuid.uuid4()),
            "name": name,
            "profileIconId": 1234,
            "revisionDate": int(timezone.now().timestamp()),
            "summonerLevel": 30,
        }

    def get_league_by_summoner_id(self, id: str, region: str) -> list[dict]:
        return [
            {
                "leagueId": str(uuid.uuid4()),
                "summonerId": id,
                "summonerName": "TestSummoner",
                "queueType": "RANKED_SOLO_5x5",
                "tier": "IRON",
                "rank": "I",
                "leaguePoints": 100,
                "wins": 50,
                "losses": 30,
                "hotStreak": False,
                "veteran": False,
                "freshBlood": False,
                "inactive": False,
                "miniSeries": {"target": 3, "wins": 1, "losses": 1, "progress": "WLN"},
            }
        ]


def getApi(api_key: str) -> Clientable:
    return TestApi(api_key)
