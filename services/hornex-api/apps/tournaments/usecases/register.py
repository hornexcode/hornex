from dataclasses import dataclass

from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.tournaments.models import Participant, Tournament


@dataclass
class RegisterParams:
    tournament_id: str
    player1: dict[str, str]
    player2: dict[str, str]
    player3: dict[str, str]
    player4: dict[str, str]
    player5: dict[str, str]
    team_name: str


@dataclass
class RegisterUseCase:
    def execute(self, params: RegisterParams):
        tournament = get_object_or_404(Tournament, id=params.tournament_id)

        team_name = params.team_name.strip()

        for user in [
            params.player1,
            params.player2,
            params.player3,
            params.player4,
            params.player5,
        ]:
            if not is_valid_email(user["email"]):
                raise ValidationError({"error": "One or more users has an invalid email."})

        Participant.objects.bulk_create(
            [
                Participant(
                    tournament=tournament,
                    email=user["email"],
                    nickname=user["nickname"],
                    team=team_name,
                )
                for user in [
                    params.player1,
                    params.player2,
                    params.player3,
                    params.player4,
                    params.player5,
                ]
            ]
        )


def is_valid_email(email: str) -> bool:
    return "@" in email
