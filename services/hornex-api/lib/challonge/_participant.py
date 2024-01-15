import os
from typing import (
    ClassVar,
    TypedDict,
    Unpack,
    cast,
)

import structlog
from requests import request

import lib.challonge as challonge

logger = structlog.get_logger(__name__)

headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Platform; Security; OS-or-CPU; Localization; rv:1.4) "
    "Gecko/20030624 Netscape/7.1 (ax)",
}


class Participant(dict[str, any]):
    OBJECT_NAME: ClassVar[str] = "tournament"

    @classmethod
    def class_url(cls) -> str:
        return "%s/v1/%ss.json?api_key=%s" % (  # noqa
            os.getenv("CHALLONGE_API_BASE_URL"),
            cls.OBJECT_NAME,
            challonge.api_key,
        )

    class CreateParams(TypedDict):
        tournament: str
        participants: list[str]

    @classmethod
    def create(cls, **params: Unpack["Participant.CreateParams"]) -> int:
        resp = request(
            method="post",
            url=cls.class_url(),
            params=params,
        )
        if not resp.ok:
            logger.warn(
                "Failed to request",
                status=resp.status_code,
                error=resp.json(),
            )
            raise Exception("Internal Server Error")

        logger.info("Created participant", data=resp.json())

        return cast(int, resp.json())
