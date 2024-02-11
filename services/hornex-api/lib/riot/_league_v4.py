from typing import cast

import structlog
from requests import request

import lib.riot as riot

logger = structlog.get_logger(__name__)


class LeagueEntry(dict[str, any]):
    league_id: str
    summoner_id: str
    summoner_name: str
    queue_type: str
    tier: str
    rank: str
    league_points: int
    wins: int
    losses: int
    hot_streak: bool
    veteran: bool
    fresh_blood: bool
    inactive: bool

    @classmethod
    def construct_from(cls, values: dict[str, any]) -> "LeagueEntry":
        klass = cls()
        for key, value in values.items():
            klass.__setitem__(key, value)
            klass.__setattr__(key, value)

        return cast("LeagueEntry", klass)


class LeagueV4(dict[str, any]):
    id: str
    account_id: str
    puuid: str
    name: str
    profile_icon_id: int
    revision_date: int
    summoner_level: int

    @classmethod
    def get_all_league_entries_by_summoner_id(
        cls,
        summoner_id: str,
    ) -> list["LeagueEntry"]:
        resp = request(
            method="get",
            url=f"https://br1.api.riotgames.com/lol/league/v4/entries/by-summoner/{summoner_id}?api_key={riot.api_key}",
        )

        if not resp.ok:
            return None

        data = resp.json()

        entries = list()

        for entry in data:
            league_entry = LeagueEntry.construct_from(
                {
                    "league_id": entry["leagueId"],
                    "summoner_id": entry["summonerId"],
                    "summoner_name": entry["summonerName"],
                    "queue_type": entry["queueType"],
                    "tier": entry["tier"],
                    "rank": entry["rank"],
                    "league_points": entry["leaguePoints"],
                    "wins": entry["wins"],
                    "losses": entry["losses"],
                    "hot_streak": entry["hotStreak"],
                    "veteran": entry["veteran"],
                    "fresh_blood": entry["freshBlood"],
                    "inactive": entry["inactive"],
                }
            )

            entries.append(league_entry)

        return cast(list[LeagueEntry], entries)
