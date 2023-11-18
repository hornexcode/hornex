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


class LeagueOfLegendsTournamentRegistrationTests(APITestCase):
    def setUp(self) -> None:
        self.user = UserFactory.new()

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

    def test_201_success(self):
        team = TeamFactory.new(created_by=self.user)
        tier = Tier.objects.create(name="test tier")
        Membership.objects.create(team=team, user=self.user)
        LeagueOfLegendsAccountFactory.new(user=self.user, tier=tier)
        for _ in range(0, 4):
            usr = UserFactory.new()
            LeagueOfLegendsAccountFactory.new(user=usr, tier=tier)
            Membership.objects.create(team=team, user=usr)

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, classification=tier
        )

        url = reverse(
            "tournament-register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(Tournament.objects.count(), 1)
        self.assertEqual(LeagueOfLegendsTournament.objects.count(), 1)

        # response checks
        self.assertEqual(resp.status_code, 201)

        # database checks
        self.assertEqual(Registration.objects.count(), 1)

    def test_400_do_not_has_enough_members_error(self):
        team = TeamFactory.new(created_by=self.user)
        tier = Tier.objects.create(name="test tier")
        tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, classification=tier
        )

        url = reverse(
            "tournament-register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.EnoughMembersError)

    def test_400_tournament_is_full_error(self):
        team = TeamFactory.new(created_by=self.user)
        Membership.objects.create(team=team, user=self.user)
        tier = Tier.objects.create(name="test tier")
        LeagueOfLegendsAccountFactory.new(user=self.user, tier=tier)
        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, classification=tier, team_size=1, max_teams=1
        )

        url = reverse(
            "tournament-register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(resp.status_code, 201)

        # -
        user_b = UserFactory.new()
        team_b = TeamFactory.new(created_by=user_b)
        Membership.objects.create(team=team_b, user=user_b)
        for _ in range(0, 4):
            Membership.objects.create(team=team, user=UserFactory.new())

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(user_b)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

        url = reverse(
            "tournament-register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team_b.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.TournamentFullError)

    def test_400_team_already_registered_error(self):
        team = TeamFactory.new(created_by=self.user)
        Membership.objects.create(team=team, user=self.user)
        tier = Tier.objects.create(name="test tier")
        LeagueOfLegendsAccountFactory.new(user=self.user, tier=tier)
        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, classification=tier, team_size=1
        )

        url = reverse(
            "tournament-register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(resp.status_code, 201)

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.TeamAlreadyRegisteredError)

    def test_400_team_member_is_not_allowed_to_registrate_error(
        self,
    ):
        team = TeamFactory.new(created_by=self.user)
        tier_bronze = Tier.objects.create(name="silver tier")
        tier_silver = Tier.objects.create(name="bronze tier")
        tier_gold = Tier.objects.create(name="gold tier")
        Membership.objects.create(team=team, user=self.user)
        LeagueOfLegendsAccountFactory.new(user=self.user, tier=tier_gold)
        for _ in range(0, 4):
            usr = UserFactory.new()
            LeagueOfLegendsAccountFactory.new(user=usr, tier=tier_bronze)
            Membership.objects.create(team=team, user=usr)

        self.tournament = LeagueOfLegendsTournamentFactory.new(
            organizer=self.user, classification=[tier_bronze, tier_silver]
        )

        url = reverse(
            "tournament-register",
            kwargs={
                "platform": "pc",
                "game": "league-of-legends",
                "id": self.tournament.id.__str__(),
            },
        )

        resp = self.client.post(
            url,
            {"team": team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], errors.TeamMemberIsNotAllowedToRegistrate)


class TournamentCRUDTests(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("api/v1/tournaments", include("tournaments.urls")),
    ]

    def setUp(self) -> None:
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)
        self.user.name = "tester"
        self.user.save()
        self.user.refresh_from_db()

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

        self.platform = Platform.objects.create(name="test platform")
        self.game = Game.objects.create(name="League of Legends")
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

        return super().setUp()

    def test_400_already_registered_error(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})

        Registration.objects.create(tournament=self.tournament, team=self.team)

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(resp.data["error"], "Team is already registered.")

    def test_400_tournament_is_full_error(self):
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

    def test_400_tournament_has_started_error(self):
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

    def test_400_team_admin_error(self):
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

    def test_team_game_400(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})
        game = Game.objects.create(name="test game")
        game.platforms.set([self.platform])
        self.tournament.game = game
        self.tournament.save()
        self.tournament.refresh_from_db()

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            resp.data["error"], "Team's game does not match tournament's game."
        )

    def test_team_platform_400(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})
        platform = Platform.objects.create(name="test platform 2")
        self.tournament.platform = platform
        self.tournament.save()
        self.tournament.refresh_from_db()

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            resp.data["error"], "Team's platform does not match tournament's platform."
        )

    def test_team_size_400(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})
        self.tournament.team_size = 2
        self.tournament.save()
        self.tournament.refresh_from_db()

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            resp.data["error"], "Team's size does not match tournament requirements."
        )

    def test_404(self):
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
        # Create three tournaments, so we'll have three
        Tournament.objects.create(**self.tournament_data)
        Tournament.objects.create(**self.tournament_data)
        Tournament.objects.create(**self.tournament_data)

        url = reverse("tournament-list")
        resp = self.client.get(f"{url}?page=1&page_size=2")

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["count"], 4)
        self.assertEqual(len(resp.data["results"]), 2)

    def test_list_200_ordering(self):
        # Create first tournament
        self.tournament_data["name"] = "first"
        self.tournament_data["start_time"] = timezone.now() - timezone.timedelta(days=7)
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
