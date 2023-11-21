import requests
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Iterable


@dataclass
class CreateTournamentCode:
    # query params
    tournament_id: int
    count: int

    # body params
    allowed_participants: dict
    metadata: str
    team_size: int
    pick_type: str
    map_type: str
    map_type: str
    spectator_type: str
    enough_players: bool


class Clientable(ABC):
    @abstractmethod
    def create_tournament_code(self, params) -> Iterable[str]:
        """
        https://developer.riotgames.com/apis#tournament-v5/POST_createTournamentCode
        """
        raise NotImplementedError


class Client(Clientable):
    def __init__(self):
        self.api_key = os.getenv("RIOT_API_KEY")
        if not self.api_key:
            raise Exception("RIOT_API_KEY not found")

    def create_tournament_code(
        self, params: CreateTournamentCode, region="americas"
    ) -> Iterable[str]:
        url = f"https://{region}.api.riotgames.com/lol/tournament-stub/v4/codes?api_key={self.api_key}"
        response = requests.post(url, data=params)

        if response.status_code != 200:
            raise Exception("Error creating tournament code")

        return response.json()
