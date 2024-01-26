import re
from typing import NotRequired, Self, TypedDict, Unpack, cast

import structlog
from requests import request

import lib.riot as riot

logger = structlog.get_logger(__name__)


def change_case(str):
    s1 = re.sub("(.)([A-Z][a-z]+)", r"\1_\2", str)
    return re.sub("([a-z0-9])([A-Z])", r"\1_\2", s1).lower()


class ValueObject(dict[str, any]):
    @classmethod
    def contruct_from(cls, values: dict[str, any]) -> Self:
        klass = cls()
        for key, value in values.items():
            klass.__setitem__(change_case(key), value)
            klass.__setattr__(change_case(key), value)

        return cast(Self, klass)


class GameDetails(ValueObject):
    class Summoner(ValueObject):
        puuid: str

    start_time: int
    winning_team: list["Summoner"]
    losing_team: list["Summoner"]
    short_code: str
    metadata: str
    game_id: int
    game_name: str
    game_type: str
    game_map: str
    game_mode: str
    region: str


class Tournament(dict[type, any]):
    class CreateParams(TypedDict):
        name: str
        provider_id: int

    class CreateTournamentCodesParams(TypedDict):
        allowed_participants: NotRequired[list[str]]
        """
        Optional list of encrypted puuids in order to validate the players
        eligible to join the lobby. NOTE: We currently do not enforce
        participants at the team level, but rather the aggregate of teamOne and
        teamTwo. We may add the ability to enforce at the team level in the future.
        """
        metadata: NotRequired[str]
        """
        Optional string that may contain any data in any format, if specified
        at all. Used to denote any custom information about the game.
        """
        team_size: int
        """
        The team size of the game. Valid values are 1-5.
        """
        pick_type: str
        """
        The pick type of the game. (Legal values: BLIND_PICK, DRAFT_MODE,
        ALL_RANDOM, TOURNAMENT_DRAFT)
        """
        map_type: str
        """
        The map type of the game. (Legal values: SUMMONERS_RIFT, HOWLING_ABYSS) """
        spectator_type: str
        """
        The spectator type of the game. (Legal values: NONE, LOBBYONLY, ALL)
        """
        enough_players: bool
        """
        Checks if allowed participants are enough to make full teams.
        """

    @classmethod
    def create(cls, **params: Unpack["Tournament.CreateParams"]) -> int:
        resp = request(
            method="post",
            url=f"https://americas.api.riotgames.com/lol/tournament-stub/v5/tournaments?api_key={riot.api_key}",
            params=params,
        )
        if not resp.ok:
            logger.error(
                "Failed to request",
                status=resp.status_code,
                error=resp.json(),
            )
            raise Exception("Internal Server Error")

        return cast(int, resp.json())

    @classmethod
    def create_tournament_codes(
        cls,
        tournament_id: int,
        count: int,
        **params: Unpack["Tournament.CreateTournamentCodesParams"],
    ) -> list[str]:
        """
        A tournament code should only be used to create a single match. If you
        reuse a tournament code, the server callback will not return stats for
        each match.
        """
        resp = request(
            method="post",
            url=f"https://americas.api.riotgames.com/lol/tournament-stub/v5/codes?count={count}&tournamentId={tournament_id}&api_key={riot.api_key}",
            params=params,
        )
        if not resp.ok:
            logger.error(
                "Failed to request",
                status=resp.status_code,
                error=resp.json(),
            )
            raise Exception("Internal Server Error")

        return cast(list[str], resp.json())

    @classmethod
    def get_game_details(cls, code: str) -> list["GameDetails"]:
        """
        :param code: The tournament code
        """
        resp = request(
            method="get",
            url=f"https://americas.api.riotgames.com/lol/tournament/v5/games/by-code/{code}?api_key={riot.api_key}",
        )
        if not resp.ok:
            logger.error(
                "Tournament.get_game_details",
                status=resp.status_code,
                error=resp.json(),
            )
            raise Exception("Failed to get game details")

        klasses: list[GameDetails] = []
        for game in resp.json():
            klass = GameDetails.contruct_from(game)
            klasses.append(klass)

        return cast(list["GameDetails"], klasses)
