import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.accounts.models import GameID
from apps.teams.models import Team
from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import RegisteredTeam
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)


@dataclass
class CreateAndRegisterTeamInput:
    tournament_id: uuid.UUID
    user_id: uuid.UUID
    name: str
    member_1_email: str
    member_2_email: str
    member_3_email: str
    member_4_email: str


@dataclass
class CreateAndRegisterTeamOutput:
    team: Team


@dataclass
class CreateAndRegisterTeamUseCase:
    @transaction.atomic
    def execute(self, params: CreateAndRegisterTeamInput) -> CreateAndRegisterTeamOutput:
        user = get_object_or_404(User, id=params.user_id)
        tournament = get_object_or_404(Tournament, id=params.tournament_id)

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
            try:
                user = User.objects.get(email=member_email)
                game_id = GameID.objects.get(email=member_email)

            except User.DoesNotExist:
                raise ValidationError({"error": f"User not found for {member_email}"})
            except GameID.DoesNotExist:
                raise ValidationError(
                    {
                        "error": f"User {member_email} does not connected its account with League "
                        "Of Legends"
                    }
                )

            team.add_member(game_id=game_id)

        try:
            participant = ChallongeTournament.add_team(
                tournament=tournament.challonge_tournament_id, team_name=team.name
            )
        except Exception:
            raise Exception("Failed to add participant at challonge")

        RegisteredTeam.objects.create(
            tournament=tournament, team=team, challonge_participant_id=participant.id
        )

        return CreateAndRegisterTeamOutput(team)
