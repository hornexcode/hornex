import uuid
from dataclasses import dataclass

from apps.teams.models import Team


@dataclass
class MountTeamInput:
    user_id: uuid.UUID
    team_name: str
    member_1_email: str
    member_2_email: str
    member_3_email: str
    member_4_email: str


@dataclass
class MountTeamOutput:
    team: Team


@dataclass
class MountTeamUseCase:
    def execute(self, params: MountTeamInput) -> None:
        pass
