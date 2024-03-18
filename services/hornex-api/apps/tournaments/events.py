import json
from abc import ABC
from dataclasses import asdict, dataclass
from typing import TypeVar

T = TypeVar("T", bound="Event")


@dataclass
class Event(ABC):
    def to_message(self):
        return asdict(self)

    # XXX: see how to return itself type
    @staticmethod
    def from_message(message: str) -> T:
        try:
            data = json.dumps(message)
            return Event(**data)
        except Exception as e:
            raise Exception("Could not parse message") from e


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
