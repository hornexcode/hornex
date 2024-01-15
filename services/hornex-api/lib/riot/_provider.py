from typing import TypedDict, Unpack, cast

import structlog
from requests import request

import lib.riot as riot

logger = structlog.get_logger(__name__)


class Provider(dict[str, any]):
    id: int

    class CreateParams(TypedDict):
        region: str
        url: str

    @classmethod
    def class_url(cls) -> str:
        return f"https://americas.api.riotgames.com/lol/tournament-stub/v5/providers?api_key={riot.api_key}"

    @classmethod
    def create(cls, **params: Unpack["Provider.CreateParams"]) -> int:
        resp = request(
            method="post",
            url=cls.class_url(),
            params=params,
        )
        if not resp.ok:
            logger.warn(
                "Failed to request",
                status=resp.status_code,
                resp=resp,
                error=resp.json(),
            )
            raise Exception("Internal Server Error")

        logger.info("Created provider", data=resp.json())
        return cast(int, resp.json())
