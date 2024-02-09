# Description: Register a team in a tournament

from rest_framework import serializers
from rest_framework.validators import ValidationError

from apps.games.models import GameID
from apps.teams.models import Team
from apps.tournaments import errors
from apps.tournaments.factories import tournament_factory
from apps.tournaments.models import Registration, Tournament
from lib.riot.client import client as riot_client


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
        :param game: str
        :return: Registration
        """
        model = tournament_factory(params.game)

        try:
            tournament = model.objects.get(id=params.tournament)
        except Tournament.DoesNotExist:
            raise ValidationError({"detail": "Tournament not found"})

        try:
            team = Team.objects.get(id=params.team)
        except Team.DoesNotExist:
            raise ValidationError({"detail": "Team not found"})

        if Registration.objects.filter(tournament=tournament, team=team).exists():
            raise ValidationError({"detail": errors.TeamAlreadyRegisteredError})

        if tournament.is_full:
            raise ValidationError({"detail": errors.TournamentFullError})

        if team.members.count() < tournament.team_size:
            raise ValidationError({"detail": errors.EnoughMembersError})

        if not tournament.is_classification_open:
            members = team.members.all()
            game_ids = GameID.objects.filter(user__in=members, game=tournament.game)

            if len(game_ids) < tournament.team_size:
                raise ValidationError({"detail": "Not enough members with the game ID"})

            for game_id in game_ids:
                if tournament.game == Tournament.GameType.LEAGUE_OF_LEGENDS:
                    summoner = riot_client.get_summoner_by_name(game_id.nickname)

                    if summoner is None:
                        raise ValidationError({"detail": "Summoner not found"})

        registration = Registration.objects.create(
            tournament=tournament,
            team=team,
            game_slug=tournament.game,
            platform_slug=tournament.platform,
        )

        return registration


class LeagueOfLegendsValidator:
    @classmethod
    def validate(cls, team, tournament):
        return True


def validator_factory(game: str):
    if game == "league-of-legends":
        return LeagueOfLegendsValidator()
