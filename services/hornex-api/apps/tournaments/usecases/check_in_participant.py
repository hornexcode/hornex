# Description: Register a team in a tournament

import structlog
from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import ValidationError

from apps.teams.models import Member, Team
from apps.tournaments import errors
from apps.tournaments.models import Checkin, Registration, Tournament
from lib.challonge import Participant as ChallongeParticipantAPIResource
from lib.challonge import Tournament as ChallongeTournamentAPIResource

logger = structlog.get_logger(__name__)


class CheckInParticipantParams:
    user_id: str
    tournament_id: str
    team_id: str

    def __init__(self, **kwargs):
        self.validate(**kwargs)
        self.user_id = kwargs.get("user_id")
        self.tournament_id = kwargs.get("tournament_id")
        self.team_id = kwargs.get("team_id")

    class Validator(serializers.Serializer):
        user_id = serializers.UUIDField()
        tournament_id = serializers.UUIDField()
        team_id = serializers.UUIDField()

    def validate(self, **kwargs):
        params = self.Validator(data=kwargs)
        params.is_valid(raise_exception=True)


class ConfirmRegistrationUseCase:
    @transaction.atomic
    def execute(self, params: CheckInParticipantParams) -> Registration:
        try:
            tournament = Tournament.objects.get(id=params.tournament_id)
        except Tournament.DoesNotExist:
            raise ValidationError({"detail": "Tournament not found"})

        try:
            team = Team.objects.get(id=params.team_id)
        except Team.DoesNotExist:
            raise ValidationError({"detail": "Team not found"})

        try:
            member = Member.objects.get(user=params.user_id)
        except Member.DoesNotExist:
            raise ValidationError({"detail": "User not found"})

        if not team.is_member(member.user):
            raise ValidationError({"detail": "User is not a member of this team"})

        if not tournament.is_checkin_open():
            raise ValidationError({"error": errors.CheckinNotOpenError})

        if not tournament.teams.filter(id=team.id).exists():
            raise ValidationError({"error": errors.TeamNotRegisteredError})

        if Checkin.objects.filter(tournament=tournament, team=team, user=member.user).exists():
            raise ValidationError({"error": errors.UserAlreadyCheckedInError})

        Checkin.objects.create(tournament=tournament, team=team, user=member.user)

        if Checkin.objects.filter(tournament=tournament, team=team).count() == 2:
            team = ChallongeParticipantAPIResource.find(
                tournament=tournament.challonge_tournament_id, name=team.name
            )

            ChallongeTournamentAPIResource.checkin_team(
                tournament.challonge_tournament_id,
            )
            return
