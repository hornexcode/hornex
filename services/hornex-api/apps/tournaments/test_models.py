import random
from django.test import TestCase
from apps.tournaments.models import Tournament, Registration, Bracket
from test.factories import TournamentFactory, UserFactory, TeamFactory
from lib.logging import logger
from datetime import datetime as dt, timezone as tz, timedelta as td


class TestUnitTournamentModel(TestCase):
    def setUp(self) -> None:
        now = dt.now(tz.utc)
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            game="League of Legends",
            max_teams=8,
            entry_fee=10,
            start_date=now + td(days=1),
            end_date=now + td(days=2),
            start_time="10:00:00",
            end_time="12:00:00",
            organizer=UserFactory.new(),
        )

    def test_tournament_name(self):
        self.assertEqual(self.tournament.name, "Test Tournament")

    def test_tournament_game(self):
        self.assertEqual(self.tournament.game, "League of Legends")

    def test_tournament_status(self):
        self.assertEqual(
            self.tournament.status, Tournament.TournamentStatusType.NOT_STARTED
        )

    def test_generate_tournament_brackets(self):
        MAX_TEAMS = 32
        teams = [TeamFactory.new() for _ in range(0, MAX_TEAMS)]

        self.tournament.teams.set(teams)
        self.tournament.save()
        self.tournament.refresh_from_db()

        self.assertEqual(32, self.tournament.get_number_of_teams())

        num_rounds = self.tournament.get_number_of_rounds()
        for _ in range(0, num_rounds):
            self.tournament.generate_brackets()
            rounds = self.tournament.rounds.all()

            self.assertEqual(1, len(rounds))
            self.assertEqual(16, rounds[0].brackets.count())
            fake_tournament_brackets_winners(self.tournament)


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
            self.registration.status, Registration.RegistrationStatusType.PENDING
        )


class TestUnitRoundModel(TestCase):
    def setUp(self) -> None:
        self.tournament = TournamentFactory.new()
        self.tournament.teams.set([TeamFactory.new() for _ in range(0, 32)])
        self.tournament.save()
        self.tournament.refresh_from_db()

    def test_rounds_count(self):
        self.assertEqual(0, self.tournament.get_number_of_rounds())

        self.tournament.generate_brackets()
        self.tournament.refresh_from_db()

        self.assertEqual(1, self.tournament.get_number_of_rounds())

        self.tournament.generate_brackets()
        self.tournament.refresh_from_db()

        self.assertEqual(1, self.tournament.get_number_of_rounds())

    def test_rounds_brackets_count(self):
        self.assertEqual(0, self.tournament.get_number_of_brackets())

        self.tournament.generate_brackets()
        self.tournament.refresh_from_db()

        self.assertEqual(16, self.tournament.get_number_of_brackets())

        self.tournament.generate_brackets()
        self.tournament.refresh_from_db()

        self.assertEqual(16, self.tournament.get_number_of_brackets())


class TestUnitBracketModel(TestCase):
    def setUp(self) -> None:
        self.tournament = TournamentFactory.new()
        self.tournament.teams.set([TeamFactory.new() for _ in range(0, 32)])
        self.tournament.save()
        self.tournament.refresh_from_db()
        self.tournament.generate_brackets()
        self.tournament.refresh_from_db()

    def test_bracket_teams_count(self):
        self.assertEqual(0, self.tournament.get_number_of_teams_in_bracket(1))

        self.tournament.generate_brackets()
        self.tournament.refresh_from_db()

        self.assertEqual(2, self.tournament.get_number_of_teams_in_bracket(1))

        self.tournament.generate_brackets()
        self.tournament.refresh_from_db()

        self.assertEqual(2, self.tournament.get_number_of_teams_in_bracket(1))


def fake_tournament_brackets_winners(tournament: Tournament):
    rounds = tournament.rounds.all().order_by("-created_at")
    if rounds.count() == 0:
        raise Exception("Not rounds were found")

    for bracket in rounds.first().brackets.all():
        bracket.set_winner(random.choice([bracket.team_a_id, bracket.team_b_id]))
