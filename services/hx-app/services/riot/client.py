import abc

import requests


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
        return f"https://{region}.api.riotgames.com/lol"


class Client(Clientable):
    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_a_summoner_by_summoner_name(self, name: str, region: str) -> dict:
        url = f"{self.get_base_url(region)}/summoner/v4/summoners/by-name/{name}"
        headers = {"X-Riot-Token": self.api_key}
        response = requests.get(url, headers=headers)
        return response.json()


def new_riot_client(api_key: str) -> Clientable:
    return Client(api_key)
