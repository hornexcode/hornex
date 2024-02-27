import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.accounts.models import GameID
from apps.teams.models import Team
from apps.users.models import User

logger = structlog.get_logger(__name__)


@dataclass
class MountTeamInput:
    user_id: uuid.UUID
    name: str
    member_1_email: str
    member_2_email: str
    member_3_email: str
    member_4_email: str


@dataclass
class MountTeamOutput:
    team: Team


@dataclass
class MountTeamUseCase:
    @transaction.atomic
    def execute(self, params: MountTeamInput) -> MountTeamOutput:
        user = get_object_or_404(User, id=params.user_id)

        if Team.objects.filter(name=params.name).exists():
            raise ValidationError({"error": "Team name already in use"})

        team = Team.objects.create(name=params.name, created_by=user)

        for member_email in [
            user.email,
            params.member_1_email,
            params.member_2_email,
            params.member_3_email,
            params.member_4_email,
        ]:
            user = User.objects.filter(email=member_email).first()
            if not user:
                raise ValidationError({"error": f"User not found for {member_email}"})

            game_id = GameID.objects.filter(email=member_email).first()
            if not game_id:
                raise ValidationError(
                    {
                        "error": f"User {member_email} does not connected its account with League "
                        "Of Legends"
                    }
                )

            team.add_member(game_id=game_id)

        return MountTeamOutput(team)
