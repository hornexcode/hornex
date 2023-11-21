import requests
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Iterable, Set
from enum import Enum


class RegionType(Enum):
    BR = "BR"
    EUNE = "EUNE"
    EUW = "EUW"
    JP = "JP"
    LAN = "LAN"
    LAS = "LAS"
    NA = "NA"
    OCE = "OCE"
    PBE = "PBE"
    RU = "RU"
    TR = "TR"
    KR = "KR"


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


@dataclass
class CreateTournamentCode:
    # query params
    tournament_id: int
    count: int

    # body params
    allowed_participants: dict
    metadata: str
    team_size: int
    pick_type: PickType
    map_type: MapType
    spectator_type: SpectatorType
    enough_players: bool


@dataclass
class UpdateTournamentCode:
    # query params
    tournament_code: str

    # body params
    allowed_participants: dict
    pick_type: PickType
    map_type: MapType
    spectator_type: SpectatorType


@dataclass
class TournamentCodeV5DTO:
    code: str
    spectators: str
    lobbyName: str
    metaData: str
    password: str
    teamSize: int
    providerId: int
    pickType: str
    tournamentId: int
    id: int
    region: str
    map: str
    participants: set[str]


@dataclass
class TournamentTeamV5:
    puuid: str


@dataclass
class TournamentGamesV5:
    winningTeam: list[TournamentTeamV5]
    losingTeam: list[TournamentTeamV5]
    shortCode: str  # Tournament Code
    metaData: str  # Metadata for the TournamentCode
    gameId: int
    gameName: str
    gameType: str
    gameMap: int  # Game Map ID
    gameMode: str
    region: str  # Region of the game


@dataclass
class LobbyEventV5DTO:
    timestamp: str  # Timestamp from the event
    eventType: str  # The type of event that was triggered
    puuid: str  # The puuid that triggered the event (Encrypted)


@dataclass
class LobbyEventV5DTOWrapper:
    eventList: list[LobbyEventV5DTO]


class Clientable(ABC):
    @abstractmethod
    def register_tournament_provider(self, url: str, region: RegionType) -> int:
        """
        Register the tournament provider

        POST /lol/tournament/v5/providers
        {
            "url": "https://example.com",
            "region": "NA"
        }
        """
        raise NotImplementedError

    @abstractmethod
    def register_tournament(self, name: str, provider_id: int) -> int:
        """
        Register the tournament and returns providerID

        POST /lol/tournament/v5/tournaments
        {
            "name": "Example Tournament",
            "providerId": 0
        }
        """
        raise NotImplementedError

    @abstractmethod
    def create_tournament_code(self, params) -> Iterable[str]:
        """
        Returns tournament codes

        POST /lol/tournament/v4/codes
        {
            "allowedSummonerIds": [
                "string-puuid"
            ],
            "metadata": "",
            "teamSize": 0
            "pickType": "",
            "mapType": "",
            "spectatorType": "",
            "enoughPlayers: true,
        }
        """
        raise NotImplementedError

    @abstractmethod
    def get_tournament_code(self, tournamentCode: str) -> TournamentCodeV5DTO:
        """
        Returns the tournament code DTO associated with a tournament code string

        GET /lol/tournament/v5/codes/{tournamentCode}
        """
        raise NotImplementedError

    @abstractmethod
    def update_tournament_code(self, params: UpdateTournamentCode) -> None:
        """
        Update the pick type, map, spectator type, or allowed puuids for a code.

        PUT /lol/tournament/v5/codes/{tournamentCode}
        {
            "allowedSummonerIds": [
                "string-puuid"
            ],
            "pickType": "",
            "mapType": "",
            "spectatorType": "",
        }
        """
        raise NotImplementedError

    @abstractmethod
    def get_games_by_code(self, tournamentCode: str) -> Set[TournamentGamesV5]:
        """
        Get games details

        GET /lol/tournament/v5/games/by-code/{tournamentCode}

        IMPLEMENTATION NOTES

        Additional endpoint to get tournament games. From this endpoint, you are able to get participants PUUID (the callback doesn't contain this info). You can also use it to check if the game was recorded and validate callbacks. If the endpoint returns the game, it means a callback was attempted. This will only work for tournament codes created after November 10, 2023.
        """
        raise NotImplementedError

    @abstractmethod
    def get_lobby_events_by_code(self, tournamentCode: str) -> LobbyEventV5DTOWrapper:
        """
        Gets a list of lobby events by tournament code.

        GET /lol/tournament/v5/lobby-events/by-code/{tournamentCode}
        """
        raise NotImplementedError


class Client(Clientable):
    def __init__(self):
        self.api_key = os.getenv("RIOT_API_KEY")
        if not self.api_key:
            raise Exception("RIOT_API_KEY not found")

    def create_tournament_code(
        self, params: CreateTournamentCode, region="americas"
    ) -> Iterable[str]:
        url = f"https://{region}.api.riotgames.com/lol/tournament-stub/v4/codes?api_key={self.api_key}"
        response = requests.post(url, data=params)

        if response.status_code != 200:
            raise Exception("Error creating tournament code")

        return response.json()
