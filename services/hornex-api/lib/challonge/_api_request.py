import structlog
from requests import request

logger = structlog.get_logger(__name__)


class APIRequest:
    @classmethod
    def _request(cls, method_, url_, params, headers):
        resp = request(method_, url_, json=params, headers=headers)

        json = resp.json()
        if resp.status_code != 200:
            logger.warn(f"Failed to create {cls.__str__}", json=json)
            raise Exception(f"Failed to create {cls.__str__}", json)

        return json
