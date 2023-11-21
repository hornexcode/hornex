import requests
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Iterable, Set
from enum import Enum
from lib.logging import logger


class RegionalRoutingType(Enum):
    AMERICAS = "americas.api.riotgames.com"
    ASIA = "asia.api.riotgames.com"
    EUROPE = "europe.api.riotgames.com"
    SEA = "sea.api.riotgames.com"


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
    allowedParticipants: list[str]
    metadata: str
    teamSize: int
    pickType: PickType
    mapType: MapType
    spectatorType: SpectatorType
    enoughPlayers: bool


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

    @classmethod
    def from_api_response(self, data):
        return self(
            code=data["code"],
            spectators=data["spectators"],
            lobbyName=data["lobbyName"],
            metaData=data["metaData"],
            password=data["password"],
            teamSize=data["teamSize"],
            providerId=data["providerId"],
            pickType=data["pickType"],
            tournamentId=data["tournamentId"],
            id=data["id"],
            region=data["region"],
            map=data["map"],
            participants=set(data["participants"]),
        )


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

    @classmethod
    def from_api_response(self, data):
        return self(
            winningTeam=data["winningTeam"],
            losingTeam=data["losingTeam"],
            shortCode=data["shortCode"],
            metaData=data["metaData"],
            gameId=data["gameId"],
            gameName=data["gameName"],
            gameType=data["gameType"],
            gameMap=data["gameMap"],
            gameMode=data["gameMode"],
            region=data["region"],
        )


@dataclass
class LobbyEventV5DTO:
    timestamp: str  # Timestamp from the event
    eventType: str  # The type of event that was triggered
    puuid: str  # The puuid that triggered the event (Encrypted)


@dataclass
class LobbyEventV5DTOWrapper:
    eventList: list[LobbyEventV5DTO]

    @classmethod
    def from_api_response(self, data):
        events = []
        for lobby_event in data:
            events.append(
                LobbyEventV5DTO(
                    timestamp=lobby_event["timestamp"],
                    eventType=lobby_event["eventType"],
                    puuid=lobby_event["puuid"],
                )
            )

        return self(eventList=events)


class Clientable(ABC):
    @abstractmethod
    def register_tournament_provider(
        self,
        url: str,
        region: RegionType,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        """
        Register the tournament provider

        POST /lol/tournament-stub/v5/providers
        {
            "url": "https://example.com",
            "region": "NA"
        }
        """
        raise NotImplementedError

    @abstractmethod
    def register_tournament(
        self,
        name: str,
        provider_id: int,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        """
        Register the tournament and returns its id

        POST /lol/tournament-stub/v5/tournaments
        {
            "name": "Example Tournament",
            "providerId": 0
        }
        """
        raise NotImplementedError

    @abstractmethod
    def create_tournament_code(
        self,
        params: CreateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> Iterable[str]:
        """
        Returns tournament codes

        POST /lol/tournament-stub/v4/codes
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
    def get_tournament_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> TournamentCodeV5DTO:
        """
        Returns the tournament code DTO associated with a tournament code string

        GET /lol/tournament-stub/v5/codes/{tournamentCode}
        """
        raise NotImplementedError

    @abstractmethod
    def update_tournament_code(
        self,
        params: UpdateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> None:
        """
        Update the pick type, map, spectator type, or allowed puuids for a code.

        PUT /lol/tournament-stub/v5/codes/{tournamentCode}
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
    def get_games_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> Set[TournamentGamesV5]:
        """
        Get games details

        GET /lol/tournament-stub/v5/games/by-code/{tournamentCode}

        IMPLEMENTATION NOTES

        Additional endpoint to get tournament games. From this endpoint, you are able to get participants PUUID (the callback doesn't contain this info). You can also use it to check if the game was recorded and validate callbacks. If the endpoint returns the game, it means a callback was attempted. This will only work for tournament codes created after November 10, 2023.
        """
        raise NotImplementedError

    @abstractmethod
    def get_lobby_events_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> LobbyEventV5DTOWrapper:
        """
        Gets a list of lobby events by tournament code.

        GET /lol/tournament-stub/v5/lobby-events/by-code/{tournamentCode}
        """
        raise NotImplementedError


class Client(Clientable):
    def __init__(self):
        self.api_key = os.getenv("RIOT_API_KEY")
        if not self.api_key:
            raise Exception("RIOT_API_KEY not found")

    def register_tournament_provider(
        self,
        url: str,
        region: RegionType,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        endpoint = f"https://{regional_routing.value}/lol/tournament-stub/v5/providers?api_key={self.api_key}"
        response = requests.post(endpoint, json={"url": url, "region": region})

        if response.status_code != 200:
            logger.warning("Error registering tournament provider", response.json())
            raise Exception("Error registering tournament provider", response.json())

        return response.json()

    def register_tournament(
        self,
        name: str,
        provider_id: int,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> int:
        endpoint = f"https://{regional_routing.value}/lol/tournament-stub/v5/tournaments?api_key={self.api_key}"
        response = requests.post(
            endpoint, json={"name": name, "providerId": provider_id}
        )

        if response.status_code != 200:
            logger.warning("Error registering tournament", response.json())
            raise Exception("Error registering tournament", response.json())

        return response.json()

    def create_tournament_code(
        self,
        params: CreateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> Iterable[str]:
        url = f"https://{regional_routing.value}/lol/tournament-stub/v5/codes?api_key={self.api_key}&tournamentId={params.tournament_id}&count={params.count}"

        response = requests.post(
            url,
            json={
                "allowedParticipants": params.allowedParticipants,
                "metadata": params.metadata,
                "teamSize": params.teamSize,
                "pickType": params.pickType.value,
                "mapType": params.mapType.value,
                "spectatorType": params.spectatorType.value,
                "enoughPlayers": params.enoughPlayers,
            },
        )

        if response.status_code != 200:
            logger.warning("Error creating tournament code", response.json())
            raise Exception("Error creating tournament code", response.json())

        return response.json()

    def get_tournament_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> TournamentCodeV5DTO:
        url = f"https://{regional_routing.value}/lol/tournament-stub/v5/codes/{tournamentCode}?api_key={self.api_key}"
        response = requests.get(url)

        if response.status_code != 200:
            logger.warning("Error retrieving tournament code DTO", response.json())
            raise Exception("Error retrieving tournament code DTO", response.json())

        data = response.json()

        tournamentCodeDTO = TournamentCodeV5DTO.from_api_response(data)

        return tournamentCodeDTO

    def update_tournament_code(
        self,
        params: UpdateTournamentCode,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> None:
        url = f"https://{regional_routing.value}/lol/tournament-stub/v5/codes?api_key={self.api_key}"

        response = requests.put(url, json=params)

        if response.status_code != 200:
            logger.warning("Error updating tournament code", response.json())
            raise Exception("Error updating tournament code", response.json())

        return response.json()

    def get_games_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> Set[TournamentGamesV5]:
        url = f"https://{regional_routing.value}/lol/tournament-stub/v5/codes/{tournamentCode}?api_key={self.api_key}"
        response = requests.get(url)

        if response.status_code != 200:
            logger.warning("Error retrieving games", response.json())
            raise Exception("Error retrieving games", response.json())

        data = response.json()

        tournament_games: Set[TournamentGamesV5] = set()
        for tournament_game in data:
            tournament_games.add(TournamentGamesV5.from_api_response(tournament_game))

        return tournament_games

    def get_lobby_events_by_code(
        self,
        tournamentCode: str,
        regional_routing: RegionalRoutingType = RegionalRoutingType.AMERICAS,
    ) -> LobbyEventV5DTOWrapper:
        url = f"https://{regional_routing.value}/lol/tournament-stub/v5/codes/{tournamentCode}?api_key={self.api_key}"
        response = requests.get(url)

        if response.status_code != 200:
            logger.warning("Error retrieving lobby events", response.json())
            raise Exception("Error retrieving lobby events", response.json())

        data = response.json()

        lobby_events = LobbyEventV5DTOWrapper.from_api_response(data)

        return lobby_events
