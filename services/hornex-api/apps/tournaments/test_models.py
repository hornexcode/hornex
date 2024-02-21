from datetime import datetime as dt
from datetime import timedelta as td
from test.factories import TeamFactory, TournamentFactory, UserFactory

from django.test import TestCase

from apps.tournaments.models import Registration, Tournament


class TestUnitTournamentModel(TestCase):
    def setUp(self) -> None:
        now = dt.now()
        self.now = now
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            game="League of Legends",
            max_teams=8,
            entry_fee=10,
            registration_start_date=now,
            registration_end_date=now + td(days=7),
            start_date=now + td(days=7),
            end_date=now + td(days=9),
            start_time="10:00:00",
            end_time="12:00:00",
            organizer=UserFactory.new(),
        )

    def test_tournament_name(self):
        self.assertEqual(self.tournament.name, "Test Tournament")

    def test_tournament_game(self):
        self.assertEqual(self.tournament.game, "League of Legends")

    def test_tournament_registration_start_date(self):
        self.assertEqual(self.tournament.registration_start_date, self.now)

    def test_tournament_registration_end_date(self):
        self.assertEqual(self.tournament.registration_end_date, self.now + td(days=7))

    def test_has_start_datetime(self):
        self.assertEqual(self.tournament._has_start_datetime(), True)


class TestUnitRegistrationModel(TestCase):
    user = UserFactory.new()
    tournament = TournamentFactory.new(organizer=user)
    team = TeamFactory.new(created_by=user)
    registration = Registration(
        tournament=tournament,
        team=team,
    )

    def test_registration_status(self):
        self.assertEqual(
            self.registration.status,
            Registration.RegistrationStatusOptions.PENDING,
        )
