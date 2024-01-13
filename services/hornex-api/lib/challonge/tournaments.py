from typing import (
    Unpack,
    cast,
)

from lib.challonge._api_request import APIRequest


class Tournament(APIRequest):
    api_key: str | None

    class CreateParams:
        name: str
        tournament_type: str = "single elimination"
        url: str | None
        subdomain: str | None
        description: str | None
        open_signup: bool
        hold_third_place_match: bool = False
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
        accept_attachments: bool = False
        hide_forum: bool = False
        show_rounds: bool = False
        private: bool = False
        notify_users_when_matches_open: bool = False
        notify_users_when_the_tournament_ends: bool = False
        sequential_pairings: bool = False
        signup_cap: int | None
        start_at: str | None
        check_in_duration: int | None
        grand_finals_modifier: str | None

    @classmethod
    def create(cls, **params: Unpack["Tournament.CreateParams"]) -> "Tournament":
        """
        Creates a new tournament
        """
        return cast(
            "Tournament",
            cls._request("post", "tournaments.json", params),
        )
