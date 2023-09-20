import uuid
from datetime import timedelta
from django.utils import timezone
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken
from mock import patch
from lib.hornex.riot.client import TestApi
from users.models import User
from platforms.models import Platform
from games.models import Game, GameAccountRiot
from teams.models import Team
from tournaments.models import (
    LeagueOfLegendsTournament,
    LeagueOfLegendsTournamentProvider,
)


class LeagueOfLegendsTournamentTests(APITestCase, URLPatternsTestCase):
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
        self.provider = LeagueOfLegendsTournamentProvider.objects.create(
            id=123456, region=LeagueOfLegendsTournamentProvider.RegionType.BR
        )

        self.tournament_data = {
            "name": "test tournament",
            "game": Game.objects.first(),
            "platform": self.platform,
            "max_teams": 2,
            "team_size": 1,
            "tier": LeagueOfLegendsTournament.Tier.IRON,
            "entry_fee": 15.00,
            "start_time": timezone.now(),
            "end_time": (timedelta(days=7) + timezone.now()),
            "organizer": self.user,
            "provider": self.provider,
        }

        self.tournament = LeagueOfLegendsTournament.objects.create(
            **self.tournament_data
        )
        self.riot_account = GameAccountRiot.objects.create(
            user=self.user,
            game=self.game,
            encrypted_summoner_id=str(uuid.uuid4()),
            encrypted_account_id=str(uuid.uuid4()),
            encrypted_puuid=str(uuid.uuid4()),
            username="Summoner Name",
            region=GameAccountRiot.RegionChoicesType.BR1,
            summoner_name="Summoner Name",
            summoner_level=79,
            revision_date=int(timezone.now().timestamp()),
        )

        return super().setUp()

    @patch("services.riot.client.Client", TestApi)
    def test_tournament_registration_201(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})
        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 201)

    def test_tournament_registration_member_riot_account_404(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})
        self.riot_account.delete()

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 404)
        self.assertEqual(
            resp.data["error"], f"Could not find {self.user.name} riot account."
        )

    @patch("services.riot.client.Client", TestApi)
    def test_tournament_registration_member_not_match_tier_400(self):
        url = reverse("tournament-register", kwargs={"id": self.tournament.id})
        self.tournament.tier = LeagueOfLegendsTournament.Tier.CHALLENGER
        self.tournament.save()
        self.tournament.refresh_from_db()

        resp = self.client.post(
            url,
            {"team": self.team.id},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(
            resp.data["error"],
            f"{self.user.name}'s tier does not match tournament tier.",
        )
