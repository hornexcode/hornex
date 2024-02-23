from dataclasses import dataclass

from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.tournaments.models import Participant, Tournament


@dataclass
class RegisterParams:
    tournament_id: str
    users: list[list[str, str]]  # email, nickname
    team: str


@dataclass
class RegisterUseCase:
    def execute(self, params: RegisterParams):
        tournament = get_object_or_404(Tournament, id=params.tournament_id)

        team = params.team.strip()

        for user in params.users:
            email, _ = user
            if not is_valid_email(email):
                raise ValidationError({"error": "One or more users has an invalid email."})

        Participant.objects.bulk_create(
            [
                Participant(tournament=tournament, email=user[0], nickname=user[1], team=team)
                for user in params.users
            ]
        )


def is_valid_email(email: str) -> bool:
    return "@" in email
