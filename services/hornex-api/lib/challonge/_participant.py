from typing import NotRequired, Optional, Self, TypedDict, Unpack, cast

import structlog
from requests import request

import lib.challonge as challonge

logger = structlog.get_logger(__name__)

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
    class CreateParams(TypedDict):
        name: str
        misc: str
        seed: NotRequired[int]

    active: bool
    checked_in_at: Optional[str]
    created_at: str
    final_rank: Optional[any]
    group_id: Optional[int]
    icon: Optional[str]
    id: int
    invitation_id: Optional[int]
    invite_email: Optional[str]
    misc: Optional[str]
    name: str
    on_waiting_list: bool
    seed: int
    tournament_id: int
    updated_at: str
    challonge_username: Optional[str]
    challonge_email_address_verified: Optional[str]
    removable: bool
    participatable_or_invitation_attached: bool
    confirm_remove: bool
    invitation_pending: bool
    display_name_with_invitation_email_address: str
    email_hash: Optional[str]
    username: Optional[str]
    attached_participatable_portrait_url: Optional[str]
    can_check_in: bool
    checked_in: bool
    reactivatable: bool

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
    def create(cls, tournament: int, **params: Unpack["Participant.CreateParams"]) -> "Participant":
        """
        Adds participants and/or seeds to a tournament (up until it is started)
        """
        logger.debug("PARAMS", data=params)
        logger.debug("REFRESH 1")

        resp = request(
            "post",
            f"https://api.challonge.com/v1/tournaments/{tournament}/participants.json?api_key={challonge.api_key}",
            headers=headers,
            json=params,
        )

        if not resp.ok:
            raise cls.on_response_error(resp)

        return cast(Participant, cls.contruct_from(resp.json()))
