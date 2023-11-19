import unittest
from tournaments.models import Tournament, Registration
from test.factories import TournamentFactory, UserFactory, TeamFactory


class TestTournamentModel(unittest.TestCase):
    tournament = Tournament(
        name="Test Tournament",
        game="League of Legends",
        max_teams=8,
        entry_fee=10,
        start_time="2021-01-01T00:00:00Z",
        end_time="2021-01-02T00:00:00Z",
    )

    def test_tournament_name(self):
        self.assertEqual(self.tournament.name, "Test Tournament")

    def test_tournament_game(self):
        self.assertEqual(self.tournament.game, "League of Legends")

    def test_tournament_status(self):
        self.assertEqual(
            self.tournament.status, Tournament.TournamentStatusType.NOT_STARTED
        )


class TestRegistrationModel(unittest.TestCase):
    user = UserFactory.new()
    tournament = TournamentFactory.new(organizer=user)
    team = TeamFactory.new(created_by=user)
    registration = Registration(
        tournament=tournament,
        team=team,
    )

    def test_registration_status(self):
        self.assertEqual(
            self.registration.status, Registration.RegistrationStatusType.PENDING
        )
