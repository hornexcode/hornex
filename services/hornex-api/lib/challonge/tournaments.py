from typing import (
    Optional,
    Unpack,
    cast,
)

from lib.challonge._api_request import APIRequest


class Tournament(APIRequest):
    api_key: Optional[str]

    class CreateParams:
        name: str
        tournament_type: str = "single elimination"
        url: Optional[str]
        subdomain: Optional[str]
        description: Optional[str]
        open_signup: Optional[bool]
        hold_third_place_match: Optional[bool] = False
        pts_for_match_win: Optional[float]
        pts_for_match_tie: Optional[float]
        pts_for_game_win: Optional[float]
        pts_for_game_tie: Optional[float]
        pts_for_bye: Optional[float]
        swiss_rounds: Optional[int]
        ranked_by: Optional[str]
        rr_pts_for_match_win: Optional[float]
        rr_pts_for_match_tie: Optional[float]
        rr_pts_for_game_win: Optional[float]
        rr_pts_for_game_tie: Optional[float]
        accept_attachments: Optional[bool] = False
        hide_forum: Optional[bool] = False
        show_rounds: Optional[bool] = False
        private: Optional[bool] = False
        notify_users_when_matches_open: Optional[bool] = False
        notify_users_when_the_tournament_ends: Optional[bool] = False
        sequential_pairings: Optional[bool] = False
        signup_cap: Optional[int]
        start_at: Optional[str]
        check_in_duration: Optional[int]
        grand_finals_modifier: Optional[str]

    @classmethod
    def create(
        cls, api_key: Optional[str], **params: Unpack["Tournament.CreateParams"]
    ) -> "Tournament":
        """
        Creates a new tournament
        """
        return cast(
            Tournament,
            cls._request("post", "tournaments.json", api_key, params),
        )
