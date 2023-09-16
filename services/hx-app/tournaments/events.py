import json
from dataclasses import dataclass, asdict
from abc import ABC
from typing import TypeVar, Generic


T = TypeVar("T", bound="Event")


@dataclass
class Event(ABC, Generic[T]):
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
class TournamentRegistrationConfirmed(Event["TournamentRegistrationConfirmed"]):
    team_id: str
    tournament_id: str
    user_id: str
    game_type: str
