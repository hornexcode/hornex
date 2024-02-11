from typing import Optional, cast

import structlog
from requests import request

import lib.riot as riot

logger = structlog.get_logger(__name__)


class Summoner(dict[str, any]):
    id: str
    account_id: str
    puuid: str
    name: str
    profile_icon_id: int
    revision_date: int
    summoner_level: int

    @classmethod
    def get_by_summoner_name(
        cls,
        summoner_name: str,
    ) -> Optional["Summoner"]:
        resp = request(
            method="get",
            url=f"https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summoner_name}?api_key={riot.api_key}",
        )

        if not resp.ok:
            return None

        data = resp.json()

        summoner = cls()
        summoner.id = data["id"]
        summoner.account_id = data["accountId"]
        summoner.puuid = data["puuid"]
        summoner.name = data["name"]
        summoner.profile_icon_id = data["profileIconId"]
        summoner.revision_date = data["revisionDate"]
        summoner.summoner_level = data["summonerLevel"]
        return cast(Summoner, summoner)
