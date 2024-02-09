from dataclasses import dataclass
from enum import Enum


class RegionalRoutingType(Enum):
    AMERICAS = "americas.api.riotgames.com"
    ASIA = "asia.api.riotgames.com"
    EUROPE = "europe.api.riotgames.com"
    SEA = "sea.api.riotgames.com"


class PlatformRoutingType(Enum):
    BR1 = "br1"
    EUN1 = "eun1"
    EUW1 = "euw1"
    JP1 = "jp1"
    KR = "kr"
    LA1 = "la1"
    LA2 = "la2"
    NA1 = "na1"
    OC1 = "oc1"
    TR1 = "tr1"
    RU = "ru"
    PH2 = "ph2"
    SG2 = "sg2"
    TH2 = "th2"
    TW2 = "tw2"
    VN2 = "vn2"


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
    tournamentCode: str

    # body params
    allowedParticipants: dict
    pickType: PickType
    mapType: MapType
    spectatorType: SpectatorType


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
    participants: list[str]

    @staticmethod
    def from_api_response(data):
        return TournamentCodeV5DTO(
            code=data.get("code"),
            spectators=data.get("spectators"),
            lobbyName=data.get("lobbyName"),
            metaData=data.get("metaData"),
            password=data.get("password"),
            teamSize=data.get("teamSize"),
            providerId=data.get("providerId"),
            pickType=data.get("pickType"),
            tournamentId=data.get("tournamentId"),
            id=data.get("id"),
            region=data.get("region"),
            map=data.get("map"),
            participants=[data.get("participants")],
        )


@dataclass
class TournamentTeamV5:
    puuid: str  # Player Unique UUID (Encrypted)


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

    @staticmethod
    def from_api_response(data):
        winning_team = [
            TournamentTeamV5(puuid=player.get("puuid")) for player in data.get("winningTeam")
        ]
        losingTeam = [
            TournamentTeamV5(puuid=player.get("puuid")) for player in data.get("losingTeam")
        ]
        return TournamentGamesV5(
            winningTeam=winning_team,
            losingTeam=losingTeam,
            shortCode=data.get("shortCode"),
            metaData=data.get("metaData"),
            gameId=data.get("gameId"),
            gameName=data.get("gameName"),
            gameType=data.get("gameType"),
            gameMap=data.get("gameMap"),
            gameMode=data.get("gameMode"),
            region=data.get("region"),
        )


@dataclass
class LobbyEventV5DTO:
    timestamp: str  # Timestamp from the event
    eventType: str  # The type of event that was triggered
    puuid: str  # The puuid that triggered the event (Encrypted)


@dataclass
class LobbyEventV5DTOWrapper:
    eventList: list[LobbyEventV5DTO]

    @staticmethod
    def from_api_response(data):
        events = []
        for lobby_event in data.get("eventList", []):
            events.append(
                LobbyEventV5DTO(
                    timestamp=lobby_event.get("timestamp"),
                    eventType=lobby_event.get("eventType"),
                    puuid=lobby_event.get("puuid"),
                )
            )

        return LobbyEventV5DTOWrapper(eventList=events)


@dataclass
class MiniSeriesDTO:
    losses: int
    progress: str
    target: int
    wins: int

    @staticmethod
    def from_api_response(data):
        return MiniSeriesDTO(
            losses=data.get("losses"),
            progress=data.get("progress"),
            target=data.get("target"),
            wins=data.get("wins"),
        )


@dataclass
class LeagueEntryDTO:
    leagueId: str
    summonerId: str
    summonerName: str
    queueType: str
    tier: str
    rank: str
    leaguePoints: int
    wins: int
    losses: int
    hotStreak: bool
    veteran: bool
    freshBlood: bool
    inactive: bool

    @staticmethod
    def from_api_response(data):
        return LeagueEntryDTO(
            leagueId=data.get("leagueId"),
            summonerId=data.get("summonerId"),
            summonerName=data.get("summonerName"),
            queueType=data.get("queueType"),
            tier=data.get("tier"),
            rank=data.get("rank"),
            leaguePoints=data.get("leaguePoints"),
            wins=data.get("wins"),
            losses=data.get("losses"),
            hotStreak=data.get("hotStreak"),
            veteran=data.get("veteran"),
            freshBlood=data.get("freshBlood"),
            inactive=data.get("inactive"),
        )

    @staticmethod
    def from_api_response_list(data_list):
        return [LeagueEntryDTO.from_api_response(data) for data in data_list]


@dataclass
class SummonerDTO:
    id: str
    account_id: str
    puuid: str
    name: str


@dataclass
class AccessTokenDTO:
    access_token: str
    expires_in: int
    id_token: str
    refresh_token: str
    scope: str
    token_type: str


@dataclass
class AccountDTO:
    puuid: str
    game_name: str
    tag_line: str
