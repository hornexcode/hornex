import abc
import requests
from .exceptions import RiotApiError


class Clientable(metaclass=abc.ABCMeta):
    @classmethod
    def __subclasshook__(cls, __subclass: type) -> bool:
        return (
            hasattr(__subclass, "get_a_summoner_by_summoner_name")
            and callable(__subclass.get_a_summoner_by_summoner_name)
            or NotImplemented
        )

    def get_a_summoner_by_summoner_name(self, name: str, region: str) -> dict:
        """Gets a summoner by summoner name."""
        pass

    def get_base_url(self, region: str) -> str:
        regions = {
            "BR1": "br1.api.riotgames.com",
            "EUN1": "eun1.api.riotgames.com",
            "EUW1": "euw1.api.riotgames.com",
            "JP1": "jp1.api.riotgames.com",
            "KR": "kr.api.riotgames.com",
            "LA1": "la1.api.riotgames.com",
            "LA2": "la2.api.riotgames.com",
            "NA1": "na1.api.riotgames.com",
            "OC1": "oc1.api.riotgames.com",
            "TR1": "tr1.api.riotgames.com",
            "RU": "ru.api.riotgames.com",
            "PH2": "ph2.api.riotgames.com",
            "SG2": "sg2.api.riotgames.com",
            "TH2": "th2.api.riotgames.com",
            "TW2": "tw2.api.riotgames.com",
            "VN2": "vn2.api.riotgames.com",
        }
        if region not in regions:
            raise RiotApiError(f"Invalid region: {region}", 400)

        return f"https://{regions[region]}/lol"


class Client(Clientable):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_a_summoner_by_summoner_name(self, name: str, region: str) -> dict:
        url = f"{self.get_base_url(region)}/summoner/v4/summoners/by-name/{name}"
        headers = {"X-Riot-Token": self.api_key}
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
        except requests.exceptions.HTTPError as err:
            if err.response.status_code == 401 or err.response.status_code == 403:
                raise RiotApiError("Internal server error", 500)
            raise

        return response.json()


def new_riot_client(api_key: str) -> Clientable:
    return Client(api_key)
