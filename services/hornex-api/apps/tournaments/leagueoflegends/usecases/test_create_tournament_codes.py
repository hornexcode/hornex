from django.test import TestCase
from unittest.mock import patch, MagicMock

from lib.riot.client import Client
from apps.tournaments.leagueoflegends.usecases import CreateTournamentCodesUseCase
from apps.tournaments.leagueoflegends.models import Code
from apps.teams.models import Team
from test.factories import (
    UserFactory,
    LeagueOfLegendsTournamentFactory,
    MatchFactory,
    LeagueOfLegendsAccountFactory,
)


class TestCreateTournamentCodes(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory.new()
        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, team_size=5, max_teams=2
        )

    @patch("requests.post")
    def test_tournament_codes_created(self, mock):
        createTournamentCodesUseCase = CreateTournamentCodesUseCase(Client)

        self.match = MatchFactory.new(self.tournament)
        teams = Team.objects.all()

        for team in teams:
            users = [UserFactory.new() for _ in range(0, 5)]
            team.members.set(users)
            members = team.members.all()
            for member in members:
                LeagueOfLegendsAccountFactory.new(member)

        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = ["fake-tournament-code"]

        mock.return_value = mock_response

        createTournamentCodesUseCase.execute(2, tournament=self.tournament)
        codes = Code.objects.count()
        self.assertEqual(codes, 1)

    def test_invalid_match_number(
        self,
    ):
        createTournamentCodesUseCase = CreateTournamentCodesUseCase(Client)

        try:
            createTournamentCodesUseCase.execute(2, tournament=self.tournament)
        except Exception as e:
            self.assertEqual(str(e), "Tournament future matches are not power of two.")

    def test_team_does_not_have_enough_players(
        self,
    ):
        createTournamentCodesUseCase = CreateTournamentCodesUseCase(Client)
        self.match = MatchFactory.new(self.tournament)

        try:
            createTournamentCodesUseCase.execute(2, tournament=self.tournament)
        except Exception as e:
            self.assertEqual(
                str(e),
                f"Team {self.match.team_a.name} does not have {self.tournament.team_size} members.",
            )

    def test_some_player_miss_league_of_legend_account(
        self,
    ):
        createTournamentCodesUseCase = CreateTournamentCodesUseCase(Client)
        self.match = MatchFactory.new(self.tournament)
        teams = Team.objects.all()

        for team in teams:
            users = [UserFactory.new() for _ in range(0, 5)]
            team.members.set(users)

        try:
            createTournamentCodesUseCase.execute(2, tournament=self.tournament)
        except Exception as e:
            self.assertIn(
                "User has no leagueoflegendsaccount.",
                str(e),
            )
