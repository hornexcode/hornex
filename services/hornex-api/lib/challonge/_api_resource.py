import os
from typing import ClassVar, Generic, TypeVar

import structlog
from requests import request

import lib.challonge as challonge
from lib.challonge._challonge_object import ChallongeObject

logger = structlog.get_logger(__name__)


T = TypeVar("T", bound=ChallongeObject)


headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Platform; Security; OS-or-CPU; Localization; rv:1.4) Gecko/20030624 Netscape/7.1 (ax)",  # noqa
    # need to include a user agent or challonge will return a 520
}


class APIResource(ChallongeObject, Generic["T"]):
    OBJECT_NAME: ClassVar[str]

    @classmethod
    def _static_request(cls, method_, url_, params=None) -> ChallongeObject:
        resp = request(
            method_,
            url_,
            headers=headers,
            json=params,
        )

        if not resp.ok:
            logger.warn("Failed to request", status=resp.status_code, resp=resp)
            return ""

        # convert dict to generic object and then return

        # return cls.construct_from(resp.json())
        return resp.json()

    @classmethod
    def class_url(cls) -> str:
        if cls == APIResource:
            raise NotImplementedError(
                "APIResource is an abstract class.  You should perform "
                "actions on its subclasses (e.g. Charge, Customer)"
            )
        # Namespaces are separated in object names with periods (.) and in URLs
        # with forward slashes (/), so replace the former with the latter.
        base = cls.OBJECT_NAME.replace(".", "/")
        return "%s/v1/%ss.json?api_key" % (  # noqa
            os.getenv("CHALLONGE_API_BASE_URL"),
            base,
            challonge.api_key,
        )

    @classmethod
    def construct_from(cls, values):
        # instance = cls()
        # instance.refresh_from(values)
        # return instance
        return cls(**values)

    def refresh_from(self, values):
        try:
            for k, v in values.items():
                setattr(self, k, v)
        except AttributeError as e:
            logger.warn("Failed to set attribute", values=values)
            raise e

        return self
