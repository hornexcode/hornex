from datetime import UTC
from datetime import datetime as dt
from datetime import timedelta as td
from test.factories import UserFactory

from django.test import TestCase

from apps.tournaments.models import Tournament


class TestUnitTournamentModel(TestCase):
    def setUp(self) -> None:
        now = dt.now(tz=UTC)
        self.now = now
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            game="League of Legends",
            max_teams=8,
            entry_fee=10,
            registration_start_date=now,
            start_date=now + td(days=7),
            start_time="10:00:00",
            organizer=UserFactory.new(),
        )

    def test_tournament_name(self):
        self.assertEqual(self.tournament.name, "Test Tournament")

    def test_tournament_game(self):
        self.assertEqual(self.tournament.game, "League of Legends")

    def test_tournament_registration_start_date(self):
        self.assertEqual(self.tournament.registration_start_date, self.now)
