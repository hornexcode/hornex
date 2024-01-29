from collections.abc import Iterable
from typing import (
    ClassVar,
    Optional,
    Self,
    TypedDict,
    Unpack,
    cast,
)

import structlog
from requests import request

import lib.challonge as challonge

logger = structlog.get_logger(__name__)

# need to include a user agent or challonge will return a 520
headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Platform; Security; OS-or-CPU; Localization; rv:1.4) "
    "Gecko/20030624 Netscape/7.1 (ax)",
}


class ValueObject(dict[str, any]):
    @classmethod
    def contruct_from(cls, values: dict[str, any]) -> Self:
        klass = cls()
        for key, value in values.items():
            klass.__setitem__(key, value)
            klass.__setattr__(key, value)

        return cast(ValueObject, klass)


class Match(ValueObject):
    OBJECT_NAME: ClassVar[str] = "tournament"

    attachment_count: Optional[int]
    created_at: str
    group_id: Optional[int]
    has_attachment: bool
    id: int
    identifier: str
    location: Optional[str]
    loser_id: Optional[int]
    player1_id: int
    player1_is_prereq_match_loser: bool
    player1_prereq_match_id: Optional[int]
    player1_votes: Optional[int]
    player2_id: int
    player2_is_prereq_match_loser: bool
    player2_prereq_match_id: Optional[int]
    player2_votes: Optional[int]
    round: int
    scheduled_time: Optional[str]
    started_at: str
    state: str
    tournament_id: int
    underway_at: Optional[str]
    updated_at: str
    winner_id: Optional[int]
    prerequisite_match_ids_csv: Optional[str]
    scores_csv: Optional[str]

    class UpdateParams(TypedDict):
        scores_csv: str
        winner_id: int
        player1_votes: int
        player2_votes: int

    @classmethod
    def on_response_error(cls, resp):
        # TODO: handle errors raising error
        try:
            errors = resp.json().get("errors", [])
            if errors:
                return Exception(errors)
            return Exception("Internal Server Error")
        except Exception as e:
            logger.error("Failed to handle error", error=e)
            return Exception("Internal Server Error")

    @classmethod
    def list(cls, tournament: int) -> Iterable["Match"]:
        """
        Retrieve a set of tournaments created with your account.
        """
        resp = request(
            "get",
            f"https://api.challonge.com/v1/tournaments/{tournament}/matches.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        data = resp.json()
        matches = [m["match"] for m in data]
        return cast(Iterable["Match"], [cls.contruct_from(m) for m in matches])

    @classmethod
    def update(
        cls, tournament: int, match: int, **params: Unpack["Match.UpdateParams"]
    ) -> "Match":
        """
        Retrieve a set of tournaments created with your account.
        """

        logger.info("Updating match", tournament=tournament, match=match, params=params)
        resp = request(
            "put",
            f"https://api.challonge.com/v1/tournaments/{tournament}/matches/{match}.json?api_key={challonge.api_key}",
            headers=headers,
            json={"match": params},
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        data = resp.json()
        return cast("Match", cls.contruct_from(data["match"]))

    @classmethod
    def mark_as_undeway(cls, tournament: int, match: int) -> "Match":
        """
        Retrieve a set of tournaments created with your account.
        """
        resp = request(
            "post",
            f"https://api.challonge.com/v1/tournaments/{tournament}/matches/{match}/mark_as_underway.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        data = resp.json()
        return cast("Match", cls.contruct_from(data["match"]))

    @classmethod
    def unmark_as_undeway(cls, tournament: int, match: int) -> "Match":
        """
        Retrieve a set of tournaments created with your account.
        """
        resp = request(
            "post",
            f"https://api.challonge.com/v1/tournaments/{tournament}/matches/{match}/unmark_as_underway.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        data = resp.json()
        return cast("Match", cls.contruct_from(data["match"]))
