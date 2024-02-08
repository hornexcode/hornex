# Description: Register a team in a tournament
from datetime import timedelta

from django.utils import timezone
from rest_framework import serializers
from rest_framework.validators import ValidationError

from apps.teams.models import Team
from apps.tournaments.models import Registration, Tournament


class CreateRegistrationUseCaseParams:
    tournament: str
    team: str
    game: str
    platform: str

    def __init__(self, **kwargs):
        self.validate(**kwargs)
        self.tournament = kwargs.get("tournament")
        self.team = kwargs.get("team")
        self.game = kwargs.get("game")
        self.platform = kwargs.get("platform")

    class Validator(serializers.Serializer):
        tournament = serializers.UUIDField()
        team = serializers.UUIDField()
        game = serializers.CharField()
        platform = serializers.CharField()

    def validate(self, **kwargs):
        params = self.Validator(data=kwargs)
        params.is_valid(raise_exception=True)


class CreateRegistrationUseCase:
    """
    Register a team in a tournament
    """

    # def __init__(self, tournament_repository, team_repository):
    #     self.tournament_repository = tournament_repository
    #     self.team_repository = team_repository

    def execute(self, params: CreateRegistrationUseCaseParams) -> Registration:
        """
        Register a team in a tournament
        :param tournament: Tournament
        :param team: Team
        :return: Registration
        """

        try:
            tournament = Tournament.objects.get(
                id=params.tournament, game=params.game, platform=params.platform
            )
        except Tournament.DoesNotExist:
            raise ValidationError({"detail": "Tournament not found"})

        try:
            team = Team.objects.get(id=params.team)
        except Team.DoesNotExist:
            raise ValidationError({"detail": "Team not found"})

        # check if tournament is open for registration
        if (
            tournament.phase != Tournament.PhaseType.REGISTRATION_OPEN
            or tournament.registration_start_date > timezone.now()
        ):
            # check if start date is in the future
            raise ValidationError(
                {"detail": "The tournament is not open for registration"}
            )

        # check if tournament is full with
        # all registrations accepted + pending created in the last 2 hours
        diff = timezone.now() - timedelta(hours=2)
        if tournament.max_teams and (
            Registration.objects.filter(
                tournament=tournament,
                status=Registration.RegistrationStatusType.ACCEPTED,
            ).count()
            + Registration.objects.filter(
                tournament=tournament,
                status=Registration.RegistrationStatusType.PENDING,
                created_at__gte=diff,
            ).count()
        ):
            raise ValidationError({"detail": "The tournament is full"})

        # check if the team is already registered
        if Registration.objects.filter(tournament=tournament, team=team).exists():
            raise ValidationError({"detail": "The team is already registered"})

        registration = Registration.objects.create(
            tournament=tournament, team=team, status="pending"
        )

        return registration
