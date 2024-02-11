# Description: Register a team in a tournament

import structlog
from rest_framework import serializers

from apps.tournaments.models import Registration

logger = structlog.get_logger(__name__)


class ConfirmRegistrationUseCaseParams:
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

    def execute(self, params: ConfirmRegistrationUseCaseParams) -> Registration:
        return
