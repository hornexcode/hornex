import os
from collections.abc import Iterable
from typing import (
    ClassVar,
    NotRequired,
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


class Participant(ValueObject):
    active: bool
    checked_in_at: str | None
    created_at: str
    final_rank: str | None
    group_id: str | None
    icon: str | None
    id: int
    invitation_id: str | None
    invite_email: str | None
    misc: str | None
    name: str
    on_waiting_list: bool
    seed: int
    tournament_id: int
    updated_at: str
    challonge_username: str | None
    challonge_email_address_verified: str | None
    removable: bool
    participatable_or_invitation_attached: bool
    confirm_remove: bool
    invitation_pending: bool
    display_name_with_invitation_email_address: str
    email_hash: str | None
    username: str | None
    attached_participatable_portrait_url: str | None
    can_check_in: bool
    checked_in: bool
    reactivatable: bool


class Tournament(ValueObject):
    OBJECT_NAME: ClassVar[str] = "tournament"

    class CreateParams(TypedDict):
        name: str
        tournament_type: str
        url: NotRequired[str]
        subdomain: NotRequired[str]
        description: NotRequired[str]
        open_signup: bool
        hold_third_place_match: bool
        pts_for_match_win: NotRequired[float]
        pts_for_match_tie: NotRequired[float]
        pts_for_game_win: NotRequired[float]
        pts_for_game_tie: NotRequired[float]
        pts_for_bye: NotRequired[float]
        swiss_rounds: NotRequired[int]
        ranked_by: NotRequired[str]
        rr_pts_for_match_win: NotRequired[float]
        rr_pts_for_match_tie: NotRequired[float]
        rr_pts_for_game_win: NotRequired[float]
        rr_pts_for_game_tie: NotRequired[float]
        accept_attachments: bool
        hide_forum: bool
        show_rounds: bool
        private: bool
        notify_users_when_matches_open: bool
        notify_users_when_the_tournament_ends: bool
        sequential_pairings: bool
        signup_cap: NotRequired[int]
        start_at: NotRequired[str]
        check_in_duration: NotRequired[int]
        grand_finals_modifier: NotRequired[str]
        teams: bool

    class AddParticipantsParams(TypedDict):
        participants: list[dict[str, str]]

    accept_attachments: bool
    allow_participant_match_reporting: bool
    anonymous_voting: bool
    category: Optional[str]
    check_in_duration: Optional[int]
    completed_at: Optional[str]
    created_at: str
    created_by_api: bool
    credit_capped: bool
    description: str
    game_id: int
    group_stages_enabled: bool
    hide_forum: bool
    hide_seeds: bool
    hold_third_place_match: bool
    id: int
    max_predictions_per_user: int
    name: str
    notify_users_when_matches_open: bool
    notify_users_when_the_tournament_ends: bool
    open_signup: bool
    participants_count: int
    prediction_method: int
    predictions_opened_at: Optional[str]
    private: bool
    progress_meter: int
    pts_for_bye: str
    pts_for_game_tie: str
    pts_for_game_win: str
    pts_for_match_tie: str
    pts_for_match_win: str
    quick_advance: bool
    ranked_by: str
    require_score_agreement: bool
    rr_pts_for_game_tie: str
    rr_pts_for_game_win: str
    rr_pts_for_match_tie: str
    rr_pts_for_match_win: str
    sequential_pairings: bool
    show_rounds: bool
    signup_cap: Optional[int]
    start_at: Optional[str]
    started_at: str
    started_checking_in_at: Optional[str]
    state: str
    swiss_rounds: int
    teams: bool
    tie_breaks: list[str]
    tournament_type: str
    updated_at: str
    url: str
    description_source: str
    subdomain: Optional[str]
    full_challonge_url: str
    live_image_url: str
    sign_up_url: Optional[str]
    review_before_finalizing: bool
    accepting_predictions: bool
    participants_locked: bool
    game_name: str
    participants_swappable: bool
    team_convertible: bool
    group_stages_were_started: bool

    @classmethod
    def class_url(cls) -> str:
        return "%s/v1/%ss.json?api_key=%s" % (  # noqa
            os.getenv("CHALLONGE_API_BASE_URL"),
            cls.OBJECT_NAME,
            challonge.api_key,
        )

    @classmethod
    def construct_from(cls, values: dict[str, any]) -> "Tournament":
        instance = cls()
        instance.refresh_from(values)
        return instance

    @classmethod
    def refresh_from(cls, values):
        try:
            for k, v in values.items():
                cls.__setattr__(k, v)
                cls.__setitem__(k, v)
        except AttributeError as e:
            logger.warn("Failed to set attribute", values=values)
            raise e

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
    def create(cls, **params: Unpack["Tournament.CreateParams"]):
        """
        Creates a new tournament
        """
        resp = request(
            "post",
            cls.class_url(),
            headers=headers,
            json=params,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        logger.info("Tournament created", resp=resp.json())

        return resp.json()

    @classmethod
    def list(cls):
        """
        Retrieve a set of tournaments created with your account.
        """
        resp = request(
            "get",
            cls.class_url(),
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        return resp.json()

    @classmethod
    def destroy(cls, tournament: int):
        """
        Deletes a tournament along with all its associated records. There is no"
        " undo, so use with care!
        """
        resp = request(
            "delete",
            f"https://api.challonge.com/v1/tournaments/{tournament}.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        logger.info("Tournament deleted", resp=resp.json())

        return resp.json()

    @classmethod
    def checkin(cls, tournament: int):
        """
        Starts a tournament, opening up first round matches for score reporting.
        """
        resp = request(
            "post",
            f"https://api.challonge.com/v1/tournaments/{tournament}/process_check_ins.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        return resp.json()

    @classmethod
    def start(cls, tournament: int):
        """
        Starts a tournament, opening up first round matches for score reporting.
        """
        resp = request(
            "post",
            f"https://api.challonge.com/v1/tournaments/{tournament}/start.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        logger.info("Tournament started", resp=resp.json())

        return resp.json()

    classmethod

    def finalize(cls, tournament: int):
        """
        Finalizes a tournament that has had all match scores submitted,
        rendering its results permanent.
        """
        resp = request(
            "post",
            f"https://api.challonge.com/v1/tournaments/{tournament}/finalize.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        logger.info("Tournament finalized", resp=resp.json())

        return resp.json()

    @classmethod
    def checkin_participant(cls, tournament: int, participant: int):
        """
        Checks a participant in, setting checked_in_at to the current time.
        """
        resp = request(
            "post",
            f"https://api.challonge.com/v1/tournaments/{tournament}/participants/{participant}/check_in.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        logger.info("Participant checked in", resp=resp.json())
        return

    @classmethod
    def add_participants(
        cls,
        tournament: int,
        **params: Unpack["Tournament.AddParticipantsParams"],
    ):
        """
        Adds participants and/or seeds to a tournament (up until it is started)
        """

        resp = request(
            "post",
            f"https://api.challonge.com/v1/tournaments/{tournament}/participants/bulk_add.json?api_key={challonge.api_key}",
            headers=headers,
            json=params,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)
        return

    @classmethod
    def add_participant(
        cls,
        tournament: int,
        **params: Unpack["Tournament.AddParticipantsParams"],
    ):
        """
        Adds participants and/or seeds to a tournament (up until it is started)
        """

        resp = request(
            "post",
            f"https://api.challonge.com/v1/tournaments/{tournament}/participants.json?api_key={challonge.api_key}",
            headers=headers,
            json=params,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)
        return

    @classmethod
    def list_participants(cls, tournament: int) -> Iterable[Participant]:
        """
        Retrieve a set of participants created with your account.
        """
        resp = request(
            "get",
            f"https://api.challonge.com/v1/tournaments/{tournament}/participants.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        results = resp.json()
        return cast(
            Iterable["Participant"],
            [Participant.contruct_from(participant["participant"]) for participant in results],
        )

    @classmethod
    def get_participant(cls, tournament: int, participant: int):
        """
        Retrieve a participant created with your account.
        """
        resp = request(
            "get",
            f"https://api.challonge.com/v1/tournaments/{tournament}/participants/{participant}.json?api_key={challonge.api_key}",
            headers=headers,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        results = resp.json()
        return results
