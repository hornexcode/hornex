import uuid
from dataclasses import dataclass

import structlog
from django.db import transaction
from django.shortcuts import get_object_or_404

from apps.accounts.models import GameID
from apps.teams.models import Team
from apps.tournaments.models import LeagueOfLegendsTournament as Tournament
from apps.tournaments.models import Registration
from apps.users.models import User
from lib.challonge import Tournament as ChallongeTournament

logger = structlog.get_logger(__name__)


@dataclass
class CreateAndRegisterTeamIntoTournamentInput:
    user_id: uuid.UUID
    tournament_id: uuid.UUID
    team_name: str
    member_1_email: str
    member_2_email: str
    member_3_email: str
    member_4_email: str
    member_5_email: str


@dataclass
class CreateAndRegisterTeamIntoTournamentOutput:
    registration: Registration


@dataclass
class CreateAndRegisterTeamIntoTournamentUseCase:
    @transaction.atomic
    def execute(
        self, params: CreateAndRegisterTeamIntoTournamentInput
    ) -> CreateAndRegisterTeamIntoTournamentOutput:
        user = get_object_or_404(User, id=params.user_id)
        tournament = get_object_or_404(Tournament, id=params.tournament_id)

        # mount team
        team = Team.objects.filter(name=params.team_name, created_by=user).first()
        if not team:
            team = Team.objects.create(
                name=params.team_name,
                created_by=tournament.organizer,
            )

            for member_email in [
                params.member_1_email,
                params.member_2_email,
                params.member_3_email,
                params.member_4_email,
                params.member_5_email,
            ]:
                user = get_object_or_404(User, email=member_email)
                game_id = get_object_or_404(GameID, user=user)
                team.add_member(game_id=game_id)

        registration = Registration.objects.create(
            tournament=tournament,
            team=team,
            game_slug=tournament.game,
            platform_slug=tournament.platform,
            status=Registration.RegistrationStatusOptions.ACCEPTED,
        )

        # add team to challoneg tournament
        try:
            participant = ChallongeTournament.add_team(
                tournament=tournament.challonge_tournament_id, team_name=team.name
            )
        except Exception as e:
            raise Exception("Failed to add participant at challonge") from e

        registration.challonge_participant_id = participant.id
        registration.save()

        return CreateAndRegisterTeamIntoTournamentOutput(registration)
