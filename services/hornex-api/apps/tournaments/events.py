import json
from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass
from typing import TypeVar

T = TypeVar("T", bound="Event")


class Bus(ABC):
    @abstractmethod
    def publish(self, topic: str, message: str):
        raise NotImplementedError


@dataclass
class Event(ABC):
    topic: str
    bus: Bus

    def to_message(self):
        return asdict(self)

    @classmethod
    def from_message(cls, message: str) -> T:
        try:
            data = json.loads(message)
            return cls(**data)
        except Exception as e:
            raise Exception("Could not parse message") from e

    def send(self):
        self.bus.publish(self.topic, json.dumps(self.to_message()))


@dataclass
class TournamentCreated(Event):
    id: str
    name: str
    game: str


@dataclass
class TournamentRegistrationConfirmed(Event):
    team_id: str
    tournament_id: str
    user_id: str
    game_slug: str
