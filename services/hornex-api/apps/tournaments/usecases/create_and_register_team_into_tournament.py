import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.validators import ValidationError

from apps.accounts.models import GameID
from apps.teams.models import Team
from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Registration
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)


@dataclass
class CreateAndRegisterTeamIntoTournamentInput:
    tournament_uuid: uuid.UUID
    user_id: uuid.UUID
    name: str
    member_1_email: str
    member_2_email: str
    member_3_email: str
    member_4_email: str


@dataclass
class CreateAndRegisterTeamIntoTournamentOutput:
    team: Team


@dataclass
class CreateAndRegisterTeamIntoTournamentUseCase:
    @transaction.atomic
    def execute(
        self, params: CreateAndRegisterTeamIntoTournamentInput
    ) -> CreateAndRegisterTeamIntoTournamentOutput:
        user = get_object_or_404(User, id=params.user_id)
        tournament = get_object_or_404(Tournament, uuid=params.tournament_uuid)

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
                game_id = GameID.objects.get(user=user)

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

        print(tournament.challonge_tournament_id, team.name)
        try:
            participant = ChallongeTournament.add_team(
                tournament=tournament.challonge_tournament_id, team_name=team.name
            )
        except Exception:
            raise Exception("Failed to add participant at challonge")

        Registration.objects.create(
            tournament=tournament,
            team=team,
            challonge_participant_id=participant.id,
            game_slug=tournament.game,
            platform_slug=tournament.platform,
            status=Registration.RegistrationStatusOptions.ACCEPTED,
        )

        return CreateAndRegisterTeamIntoTournamentOutput(team)
