import os
from typing import (
    ClassVar,
    NotRequired,
    Optional,
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


class Tournament(dict[str, any]):
    OBJECT_NAME: ClassVar[str] = "tournament"

    class CreateParams(TypedDict):
        name: str
        tournament_type: str
        url: NotRequired[str]
        subdomain: NotRequired[str]
        description: NotRequired[str]
        open_signup: bool
        hold_third_place_match: bool
        pts_for_match_win: float | None
        pts_for_match_tie: float | None
        pts_for_game_win: float | None
        pts_for_game_tie: float | None
        pts_for_bye: float | None
        swiss_rounds: int | None
        ranked_by: str | None
        rr_pts_for_match_win: float | None
        rr_pts_for_match_tie: float | None
        rr_pts_for_game_win: float | None
        rr_pts_for_game_tie: float | None
        accept_attachments: bool
        hide_forum: bool
        show_rounds: bool
        private: bool
        notify_users_when_matches_open: bool
        notify_users_when_the_tournament_ends: bool
        sequential_pairings: bool
        signup_cap: int | None
        start_at: str | None
        check_in_duration: int | None
        grand_finals_modifier: str | None

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

    def refresh_from(self, values):
        try:
            for k, v in values.items():
                setattr(self, k, v)
        except AttributeError as e:
            logger.warn("Failed to set attribute", values=values)
            raise e

        return self

    @classmethod
    def handle_error(cls, resp):
        logger.warn(
            "Failed to request",
            status=resp.status_code,
            resp=resp,
            error=resp.json(),
        )
        errors = resp.json().get("errors", [])
        if errors:
            return Exception(errors)
        return Exception("Internal Server Error")

    @classmethod
    def create(cls, **params: Unpack["Tournament.CreateParams"]) -> "Tournament":
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
            raise cls.handle_error(resp)

        return cast("Tournament", cls.construct_from(resp.json()[cls.OBJECT_NAME]))

    @classmethod
    def list(cls) -> list["Tournament"]:
        """
        Retrieve a set of tournaments created with your account.
        """
        resp = request(
            "get",
            cls.class_url(),
            headers=headers,
        )

        if not resp.ok:
            raise cls.handle_error(resp)

        results = resp.json()
        return [
            cls.construct_from(tournament[cls.OBJECT_NAME]) for tournament in results
        ]
