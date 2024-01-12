from typing import (
    ClassVar,
    Dict,
    Iterator,
    List,
    Optional,
    Union,
    cast,
    overload,
)

from lib.challonge._api_request import APIRequest


class Tournament(APIRequest):
    _url: str
    name: str
    url: str
    description: Optional[str]

    @classmethod
    def create(*args, **kwargs):
        url = "/tournaments"
        return cast(
            Tournament,
            "post",
        )
