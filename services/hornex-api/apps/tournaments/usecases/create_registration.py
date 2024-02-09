# Description: Register a team in a tournament

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
            tournament = Tournament.objects.get(id=params.tournament)
        except Tournament.DoesNotExist:
            raise ValidationError({"detail": "Tournament not found"})

        try:
            team = Team.objects.get(id=params.team)
        except Team.DoesNotExist:
            raise ValidationError({"detail": "Team not found"})

        registration = tournament.register(team)

        return registration
