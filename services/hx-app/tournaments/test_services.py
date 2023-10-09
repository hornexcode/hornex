# Should be integration tests
import mock

from datetime import timedelta
from django.utils import timezone
from django.test import TestCase

from tournaments.events import TournamentRegistrationConfirmed
from tournaments.services import TournamentManagementService
from users.models import User
from platforms.models import Platform
from games.models import Game
from teams.models import Team
from tournaments.models import (
    Tournament,
    TournamentTeam,
    Bracket,
    Registration,
)


class TestTournamentManagementServiceHelpers(TestCase):
    def test_produce_tournament_registration_confirmed_event_ok(self):
        with mock.patch("tournaments.services.register_tournament.delay") as delay_mock:
            from tournaments.services import (
                tournament_created,
            )

            msg_stub = TournamentRegistrationConfirmed(
                tournament_id="tournament_id",
                team_id="tournament_team_id",
                game_slug="league-of-legends",
                user_id="user_id",
            )
            tournament_created(msg_stub)

            delay_mock.assert_called_once_with(msg_stub)


class TestTournamentManagementServiceConfirmRegistration(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_superuser(
            name="admin",
            email="admin@hornex.gg",
            password="admin",
        )

        self.platform = Platform.objects.create(name="test platform")
        self.game = Game.objects.create(name="test game")
        self.game.platforms.set([self.platform])
        self.team = Team.objects.create(
            name="test team",
            created_by=self.user,
            game=self.game,
            platform=self.platform,
        )

        self.tournament_data = {
            "name": "test tournament",
            "game": Game.objects.first(),
            "platform": self.platform,
            "max_teams": 2,
            "team_size": 1,
            "entry_fee": 15.00,
            "start_time": timezone.now(),
            "end_time": (timedelta(days=7) + timezone.now()),
            "organizer": self.user,
        }

        self.tournament = Tournament.objects.create(**self.tournament_data)

        self.tournament_registration = Registration.objects.create(
            tournament=self.tournament, team=self.team
        )

        self.confirm_registration = TournamentManagementService().confirm_registration

        return super().setUp()

    def test_tournament_registration_already_at_tournament(self):
        TournamentTeam.objects.create(
            tournament=self.tournament,
            team=self.team,
        )

        try:
            self.confirm_registration(self.tournament_registration)

        except Exception as e:
            self.assertRaises(Exception, e)
            self.assertEqual(str(e), "Team is already at tournament.")

    def test_tournament_is_full(self):
        self.tournament.max_teams = 1
        self.tournament.save()
        self.tournament.refresh_from_db()

        # Create second registration
        team = Team.objects.create(
            name="test team second",
            created_by=self.user,
            game=self.game,
            platform=self.platform,
        )

        first_regis = Registration.objects.create(
            tournament=self.tournament, team=self.team
        )
        sec_regis = Registration.objects.create(tournament=self.tournament, team=team)

        try:
            self.confirm_registration(first_regis)
            self.confirm_registration(sec_regis)
        except Exception as e:
            self.assertRaises(Exception, e)
            self.assertEqual(str(e), "Tournament is full.")

    def test_tournament_registration_tournament_not_open(self):
        self.tournament.status = Tournament.TournamentStatusType.CANCELLED
        self.tournament.save()
        self.tournament.refresh_from_db()

        tournament_registration = Registration.objects.create(
            tournament=self.tournament, team=self.team
        )

        try:
            self.confirm_registration(tournament_registration)

        except Exception as e:
            self.assertRaises(Exception, e)
            self.assertEqual(str(e), "Tournament has started or finished.")


class TestTournamentManagementServiceGenerateBrackets(TestCase):
    def setUp(self) -> None:
        self.user = User.objects.create_superuser(
            email="admin",
            password="admin",
        )

        self.platform = Platform.objects.create(name="test platform")
        self.game = Game.objects.create(name="test game")
        self.game.platforms.set([self.platform])

        self.tournament = Tournament.objects.create(
            name="test tournament",
            game=self.game,
            platform=self.platform,
            max_teams=4,
            team_size=1,
            entry_fee=15.00,
            start_time=timezone.now(),
            end_time=(timedelta(days=7) + timezone.now()),
            organizer=self.user,
        )

        for i in range(4):
            user = User.objects.create_user(
                name=f"user {i+1}",
                email=f"email{i}@hornex.gg",
                password="testpass",
            )
            team = Team.objects.create(
                name=f"test team {i+1}",
                created_by=user,
                game=self.game,
                platform=self.platform,
            )
            TournamentTeam.objects.create(tournament=self.tournament, team=team)

        self.svc = TournamentManagementService()

        return super().setUp()

    def test_generate_brackets(self):
        self.svc.generate_brackets(self.tournament)
        self.tournament.refresh_from_db()

        self.assertEqual(
            self.tournament.status, Tournament.TournamentStatusType.STARTED
        )
        self.assertEqual(Bracket.objects.filter(tournament=self.tournament).count(), 3)

    def test_generate_brackets_already_started(self):
        try:
            self.svc.generate_brackets(self.tournament)
            self.tournament.refresh_from_db()
            self.svc.generate_brackets(self.tournament)

        except Exception as e:
            self.assertRaises(Exception, e)
            self.assertEqual(str(e), "This tournament has already started.")

    def test_generate_brackets_participants_should_be_a_power_of_two(self):
        try:
            self.tournament.max_teams = 6
            self.tournament.save()
            self.tournament.refresh_from_db()
            self.svc.generate_brackets(self.tournament)

        except Exception as e:
            self.assertRaises(Exception, e)
            self.assertEqual(str(e), "Participants should be a power of 2.")

    def test_generate_brackets_tournament_should_have_enough_teams(self):
        try:
            self.tournament.max_teams = 8
            self.tournament.save()
            self.tournament.refresh_from_db()
            self.svc.generate_brackets(self.tournament)

        except Exception as e:
            self.assertRaises(Exception, e)
            self.assertEqual(str(e), "Tournament doesn't have enough registered teams.")
