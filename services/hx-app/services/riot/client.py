import abc


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


class Client(Clientable):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://na1.api.riotgames.com/lol"


def new_client(api_key: str) -> Clientable:
    return Client(api_key)
