from test.factories import LeagueOfLegendsTournamentFactory, UserFactory
from unittest.mock import MagicMock, patch

from django.test import TestCase

from apps.leagueoflegends.usecases import (
    GetOrRegisterLeagueOfLegendsTournamentUseCase,
)
from lib.riot.client import Client


class TestRegisterTournament(TestCase):
    def setUp(self) -> None:
        self.user = UserFactory.new()
        self.tournament = LeagueOfLegendsTournamentFactory.new(organizer=self.user)

    @patch("requests.post")
    def test_register_tournament_use_case_success(self, mock):
        getOrRegisterTournamentUseCase = GetOrRegisterLeagueOfLegendsTournamentUseCase(
            Client
        )

        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = 7

        mock.return_value = mock_response

        tournament_id = getOrRegisterTournamentUseCase.execute(
            tournament=self.tournament
        )

        self.assertEqual(tournament_id, 7)
        self.assertEqual(self.tournament.riot_id, tournament_id)

    @patch("requests.post")
    def test_register_tournament_use_case_request_failure(self, mock):
        getOrRegisterTournamentUseCase = GetOrRegisterLeagueOfLegendsTournamentUseCase(
            Client
        )

        mock_response = MagicMock()
        mock_response.status_code = 500

        mock.return_value = mock_response

        try:
            getOrRegisterTournamentUseCase.execute(tournament=self.tournament)
        except Exception as e:
            msg, json = e.args
            self.assertRaises(
                Exception,
            )
            self.assertEqual(msg, "Error registering tournament")

        self.assertIsNone(self.tournament.riot_id)
