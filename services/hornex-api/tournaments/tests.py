# Test cases for the tournaments app from client side
import uuid

from datetime import timedelta
from django.utils import timezone
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken
from users.models import User
from platforms.models import Platform
from games.models import Game
from teams.models import Team, Membership
from tournaments.models import Tournament, Registration
from tournaments.leagueoflegends.models import LeagueOfLegendsTournament, Tier
from tournaments import errors

from test.factories import (
    UserFactory,
    TeamFactory,
    TournamentFactory,
    LeagueOfLegendsTournamentFactory,
    LeagueOfLegendsAccountFactory,
)
from lib.logging import logger


# class TournamentCRUDTests(APITestCase, URLPatternsTestCase):
#     urlpatterns = [
#         path("api/v1/tournaments", include("tournaments.urls")),
#     ]

#     def setUp(self) -> None:
#         self.credentials = {
#             "email": "testuser",
#             "password": "testpass",
#         }

#         self.user = User.objects.create_user(**self.credentials)
#         self.user.name = "tester"
#         self.user.save()
#         self.user.refresh_from_db()

#         # Generating a JWT token for the test user
#         self.refresh = RefreshToken.for_user(self.user)

#         # Authenticate the client with the token
#         self.client.credentials(
#             HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
#         )

#         self.platform = Platform.objects.create(name="test platform")
#         self.game = Game.objects.create(name="League of Legends")
#         self.game.platforms.set([self.platform])
#         self.team = Team.objects.create(
#             name="test team",
#             created_by=self.user,
#             game=self.game,
#             platform=self.platform,
#         )

#         self.tournament_data = {
#             "name": "test tournament",
#             "game": Game.objects.first(),
#             "platform": self.platform,
#             "max_teams": 2,
#             "team_size": 1,
#             "entry_fee": 15.00,
#             "start_time": timezone.now(),
#             "end_time": (timedelta(days=7) + timezone.now()),
#             "organizer": self.user,
#         }

#         self.tournament = Tournament.objects.create(**self.tournament_data)

#     def test_tournament_list(self):
#         url = reverse("tournament-list")
#         resp = self.client.get(url)

#         self.assertEqual(resp.status_code, 200)
#         self.assertEqual(len(resp.data["results"]), 1)

#     def test_list_200_filter(self):
#         # second Tournament
#         game = Game.objects.create(name="test game 2")
#         game.platforms.set([self.platform])
#         self.tournament_data["game"] = game
#         Tournament.objects.create(**self.tournament_data)

#         url = reverse("tournament-list")
#         resp = self.client.get(f"{url}?game={self.game.slug}")

#         self.assertEqual(resp.status_code, 200)
#         self.assertEqual(resp.data["count"], 1)
#         self.assertEqual(len(resp.data["results"]), 1)

#     def test_list_200_pagination(self):
#         # Create three tournaments, so we'll have three
#         Tournament.objects.create(**self.tournament_data)
#         Tournament.objects.create(**self.tournament_data)
#         Tournament.objects.create(**self.tournament_data)

#         url = reverse("tournament-list")
#         resp = self.client.get(f"{url}?page=1&page_size=2")

#         self.assertEqual(resp.status_code, 200)
#         self.assertEqual(resp.data["count"], 4)
#         self.assertEqual(len(resp.data["results"]), 2)

#     def test_list_200_ordering(self):
#         # Create first tournament
#         self.tournament_data["name"] = "first"
#         self.tournament_data["start_time"] = timezone.now() - timezone.timedelta(days=7)
#         Tournament.objects.create(**self.tournament_data)

#         # Create second tournament with start_time 7 days after
#         self.tournament_data["name"] = "second"
#         self.tournament_data["start_time"] = timezone.now() + timezone.timedelta(days=7)
#         Tournament.objects.create(**self.tournament_data)

#         url = reverse("tournament-list")

#         resp = self.client.get(f"{url}?ordering=start_time")
#         self.assertEqual(resp.status_code, 200)
#         self.assertEqual(resp.data["results"][0]["name"], "first")

#         resp = self.client.get(f"{url}?ordering=-start_time")
#         self.assertEqual(resp.status_code, 200)
#         self.assertEqual(resp.data["results"][0]["name"], "second")
