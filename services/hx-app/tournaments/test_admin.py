# Integration tests
from django.contrib import admin
from datetime import timedelta
from django.utils import timezone
from rest_framework.test import APITestCase, URLPatternsTestCase
from django.urls import include, path, reverse

from tournaments.admin import TournamentRegistrationAdmin
from tournaments.models import TournamentRegistration, TournamentTeam, Tournament
from users.models import User
from platforms.models import Platform
from games.models import Game
from teams.models import Team


class TestTournamentAdmin(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("admin/", admin.site.urls),
    ]

    def setUp(self) -> None:
        self.credentials = {
            "email": "testuser",
            "name": "admin",
            "password": "testpass",
        }

        self.user = User.objects.create_superuser(**self.credentials)

        # Authenticate the client to panel
        self.client.login(**self.credentials)

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

        self.tournament_registration = TournamentRegistration.objects.create(
            tournament=self.tournament, team=self.team
        )

        return super().setUp()

    def test_accept_tournament_registration(self):
        url = reverse("admin:tournaments_tournamentregistration_changelist")

        fixtures = [self.tournament]

        data = {
            "csrfmiddlewaretoken": "81ACpY0SHLub7XflJaobI1rvyG9Ei9nAPOI8MqOuAYf7j5yTwNxLdJkey3pm53yk",
            "action": "accept_team_registration",
            "index": 0,
            "select_across": 0,
            "_selected_action": self.tournament.id,
            # "_selected_action": [str(f.id) for f in fixtures],
        }

        response = self.client.post(
            url, data, follow=True, content_type="application/x-www-form-urlencoded"
        )

        print(response.status_code)

        # TournamentRegistrationAdmin.accept_team_registration(
        #     self,
        #     request=None,
        #     queryset=TournamentRegistration.objects.filter(
        #         id=self.tournament_registration.id
        #     ),
        # )

        # self.tournament_registration.refresh_from_db()

        self.assertIsNotNone(
            TournamentTeam.objects.filter(
                tournament=self.tournament_registration.tournament,
                team=self.tournament_registration.team,
            ).first()
        )
        self.assertIsNotNone(self.tournament_registration.confirmed_at)

    def test_accept_multiple_tournament_registrations(self):
        # Create second registration
        team = Team.objects.create(
            name="test team second",
            created_by=self.user,
            game=self.game,
            platform=self.platform,
        )

        tournament_registration = TournamentRegistration.objects.create(
            tournament=self.tournament, team=team
        )

        TournamentRegistrationAdmin.accept_team_registration(
            self,
            request=None,
            queryset=TournamentRegistration.objects.filter(
                id__in=[self.tournament_registration.id, tournament_registration.id]
            ),
        )

        # Refresh registrations after accepting
        self.tournament_registration.refresh_from_db()
        tournament_registration.refresh_from_db()

        tournament_teams = TournamentTeam.objects.filter(
            tournament=self.tournament_registration.tournament,
        ).all()

        self.assertEqual(len(tournament_teams), 2)
        self.assertIsNotNone(self.tournament_registration.confirmed_at)
        self.assertIsNotNone(tournament_registration.confirmed_at)
