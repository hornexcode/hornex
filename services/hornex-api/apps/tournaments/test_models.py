import random
from django.test import TestCase
from apps.tournaments.models import Tournament, Registration
from test.factories import TournamentFactory, UserFactory, TeamFactory
from datetime import datetime as dt, timezone as tz, timedelta as td


class TestUnitTournamentModel(TestCase):
    def setUp(self) -> None:
        now = dt.now(tz.utc)
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

    def test_tournament_phase(self):
        self.assertEqual(self.tournament.phase, Tournament.PhaseType.REGISTRATION_OPEN)

    def test_tournament_registration_start_date(self):
        self.assertEqual(self.tournament.registration_start_date, self.now)

    def test_tournament_registration_end_date(self):
        self.assertEqual(self.tournament.registration_end_date, self.now + td(days=7))

    def test_has_start_datetime(self):
        self.assertEqual(self.tournament._has_start_datetime(), True)

    def test_generate_tournament_brackets(self):
        MAX_TEAMS = 32
        teams = [TeamFactory.new() for _ in range(0, MAX_TEAMS)]

        self.tournament.teams.set(teams)
        self.tournament.save()
        self.tournament.refresh_from_db()

        self.assertEqual(32, self.tournament.teams.count())

        num_rounds = self.tournament.get_number_of_rounds()

        num_teams = MAX_TEAMS
        for index in range(1, num_rounds + 1):
            self.tournament.generate_brackets()
            rounds = self.tournament.rounds.all()

            if num_teams < 2:
                return

            self.assertEqual(index, len(rounds))
            self.assertEqual(num_teams / 2, rounds[0].matches.count())
            fake_tournament_brackets_winners(self.tournament)
            num_teams = num_teams / 2

    def test_start_tournament(self):
        MAX_TEAMS = 16
        teams = [TeamFactory.new() for _ in range(0, MAX_TEAMS)]

        self.tournament.teams.set(teams)
        self.tournament.save()
        self.tournament.refresh_from_db()

        self.tournament.start()

        self.assertEqual(self.tournament.phase, Tournament.PhaseType.RESULTS_TRACKING)


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
    ...


class TestUnitBracketModel(TestCase):
    ...


def fake_tournament_brackets_winners(tournament: Tournament):
    rounds = tournament.rounds.all().order_by("-created_at")
    if rounds.count() == 0:
        raise Exception("Not rounds were found")

    for bracket in rounds.first().matches.all():
        bracket.set_winner(random.choice([bracket.team_a_id, bracket.team_b_id]))
