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
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)


@dataclass
class RegisterTeamIntoTournamentInput:
    tournament_id: uuid.UUID
    team_id: uuid.UUID


@dataclass
class RegisterTeamIntoTournamentOutput:
    team: Team


@dataclass
class RegisterTeamIntoTournamentUseCase:
    @transaction.atomic
    def execute(
        self, params: RegisterTeamIntoTournamentInput
    ) -> RegisterTeamIntoTournamentOutput:
        tournament = get_object_or_404(Tournament, id=params.tournament_id)
        team = get_object_or_404(Team, id=params.team_id)

        members: list[GameID] = team.members.all()

        if len(members) < tournament.team_size:
            raise ValidationError({"error": "Team does not have enough members"})

        for game_id in members:
            if not game_id.is_active:
                raise ValidationError(
                    {
                        "error": f"Player {game_id.user.name} ({game_id.user.email}) has no active"
                        " League Of Legend account connected"
                    }
                )

        try:
            participant = ChallongeTournament.add_team(
                tournament=tournament.challonge_tournament_id, team_name=team.name
            )
        except Exception:
            raise Exception("Failed to add participant at challonge")

        Registration.objects.create(
            tournament=tournament, team=team, challonge_participant_id=participant.id
        )

        return RegisterTeamIntoTournamentOutput(team)
