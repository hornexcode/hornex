import os

import structlog
from requests import request

import lib.challonge as challonge

logger = structlog.get_logger(__name__)


class APIRequest:
    @classmethod
    def _request(cls, method_, endpoint_, params=None):
        url = f"{os.getenv('CHALLONGE_API_BASE_URL')}/{endpoint_}?api_key={challonge.api_key}"

        resp = request(
            method_,
            url,
            json=params,
            # May this is a best approach?
            # auth=(os.getenv("CHALLONGE_API_USERNAME"), os.getenv("CHALLONGE_API_KEY")),
        )

        json = resp.json()
        logger.debug(resp=json)
        if not (resp.status_code < 300):
            logger.warn(f"Failed to create {cls.__str__}", json=json)
            raise Exception(f"Failed to create {cls.__str__}", json)

        return json
