from typing import TypedDict, Unpack, cast

import structlog
from requests import request

import lib.riot as riot

logger = structlog.get_logger(__name__)


class Tournament(dict[type, any]):
    class CreateParams(TypedDict):
        name: str
        provider_id: int

    @classmethod
    def class_url(cls) -> str:
        return f"https://americas.api.riotgames.com/lol/tournament-stub/v5/tournaments?api_key={riot.api_key}"

    @classmethod
    def create(cls, **params: Unpack["Tournament.CreateParams"]) -> int:
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

        logger.info("Created tournament", data=resp.json())

        return cast(int, resp.json())

    def __init__(self, data: dict[type, any]):
        self.id: int = data["id"]
        self.name: str = data["name"]
        self.provider_id: int = data["providerId"]
