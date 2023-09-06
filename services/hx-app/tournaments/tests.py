import uuid

from datetime import timedelta
from django.utils import timezone
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken


from users.models import User
from platforms.models import Platform
from games.models import Game
from teams.models import Team
from tournaments.models import Tournament


class TournamentTests(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("api/v1/tournaments", include("tournaments.urls")),
    ]

    def setUp(self) -> None:
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
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

        self.tournament = Tournament.objects.create(
            name="test tournament",
            game=Game.objects.first(),
            platform=self.platform,
            max_teams=2,
            entry_fee=15.00,
            start_time=timezone.now(),
            end_time=(timedelta(days=7) + timezone.now()),
            organizer=self.user,
        )

        return super().setUp()

    def test_tournament_registration_201(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})
        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 201)

    def test_tournament_registration_400_already_registered_error(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})

        # Ensure that the same team cannot register twice
        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 201)

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], "Team is already registered.")

    def test_tournament_registration_400_tournament_is_full_error(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})
        # Ensure that the tournament is full
        self.tournament.max_teams = 0
        self.tournament.save()

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], "Tournament is full.")

    def test_tournament_registration_400_tournament_has_started_error(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})

        # Ensure that the tournament has started
        self.tournament.end_time = timezone.now() - timedelta(days=2)
        self.tournament.save()

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], "Tournament has started or finished.")

        self.end_time = timezone.now() + timedelta(days=10)
        self.status = Tournament.TournamentStatusType.STARTED
        self.tournament.save()

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], "Tournament has started or finished.")

    def test_tournament_registration_400_team_admin_error(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})

        u = User.objects.create_user(email="testuser2", password="testpass")
        refresh = RefreshToken.for_user(u)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            resp.data["error"], "Only team admin can register for a tournament."
        )

    def test_tournament_registration_404(self):
        url = reverse("tournament-register", kwargs={"id": uuid.uuid4()})
        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 404)

    def test_tournament_list(self):
        url = reverse("tournament-list")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data["results"]), 1)

    def test_list_200_filter(self):
        # first Tournament
        Tournament.objects.create(**self.tournament_data)

        # second Tournament
        game = Game.objects.create(name="test game 2")
        game.platforms.set([self.platform])
        self.tournament_data["game"] = game
        Tournament.objects.create(**self.tournament_data)

        url = reverse("tournament-list")
        resp = self.client.get(f"{url}?game={self.game.slug}")

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["count"], 1)
        self.assertEqual(len(resp.data["results"]), 1)

    def test_list_200_pagination(self):
        # Create three tournaments
        Tournament.objects.create(**self.tournament_data)
        Tournament.objects.create(**self.tournament_data)
        Tournament.objects.create(**self.tournament_data)

        url = reverse("tournament-list")
        resp = self.client.get(f"{url}?page=1&page_size=2")

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["count"], 3)
        self.assertEqual(len(resp.data["results"]), 2)

    def test_list_200_ordering(self):
        # Create first tournament
        self.tournament_data["name"] = "first"
        self.tournament_data["start_time"] = timezone.now()
        Tournament.objects.create(**self.tournament_data)

        # Create second tournament with start_time 7 days after
        self.tournament_data["name"] = "second"
        self.tournament_data["start_time"] = timezone.now() + timezone.timedelta(days=7)
        Tournament.objects.create(**self.tournament_data)

        url = reverse("tournament-list")

        resp = self.client.get(f"{url}?ordering=start_time")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["results"][0]["name"], "first")

        resp = self.client.get(f"{url}?ordering=-start_time")
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["results"][0]["name"], "second")
