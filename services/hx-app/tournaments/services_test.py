# Should be integration tests
import mock

from datetime import timedelta
from django.utils import timezone
from django.test import TestCase
from tournaments.events import TournamentRegistrationConfirmed
from tournaments.services import TournamentManagementService
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User
from platforms.models import Platform
from games.models import Game
from teams.models import Team, TeamMember
from tournaments.models import Tournament, TournamentTeam, Bracket


class TestTournamentManagementServiceHelpers(TestCase):
    def test_produce_tournament_registration_confirmed_event_ok(self):
        with mock.patch(
            "tournaments.services.register_tournament_for_game.delay"
        ) as delay_mock:
            from tournaments.services import (
                produce_tournament_registration_confirmed_event,
            )

            msg_stub = TournamentRegistrationConfirmed(
                tournament_id="tournament_id",
                team_id="tournament_team_id",
                game_slug="game_slug",
                user_id="user_id",
            )
            produce_tournament_registration_confirmed_event(msg_stub)

            delay_mock.assert_called_once_with("tournament_id", "team_id")


class TestTournamentManagementService(TestCase):
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
                password=f"testpass",
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
