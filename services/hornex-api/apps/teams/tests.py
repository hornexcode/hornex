from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from apps.users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from apps.teams.models import Team

prefix = "api/v1/<str:platform>/<str:game>"


class TeamTests(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path(f"{prefix}/teams", include("teams.urls")),
    ]

    def setUp(self):
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

        self.platform = Team.PlatformType.PC
        self.game = Team.GameType.LEAGUE_OF_LEGENDS

    def test_create_team_201_success(self):
        """
        Ensure we can create a new team object.
        """

        url = reverse(
            "team-list",
            kwargs={
                "game": self.game,
                "platform": self.platform,
            },
        )

        resp = self.client.post(
            url,
            {"name": "Test team", "description": "Just a test description"},
        )

        self.assertEqual(resp.status_code, 201)
        self.assertEqual(Team.objects.count(), 1)

    def test_create_team_401_unauthorized_error(self):
        """
        Ensure we can't create a new team object without authentication.
        """

        self.client.credentials()
        url = reverse(
            "team-list",
            kwargs={
                "game": self.game,
                "platform": self.platform,
            },
        )
        resp = self.client.post(
            url,
            {"name": "test team", "game": self.game, "platform": self.platform},
        )

        self.assertEqual(resp.status_code, 401)

    def test_create_team_400_bad_request_error(self):
        """
        Ensure we can't create a new team object with a missing field.
        """

        url = reverse(
            "team-list",
            kwargs={
                "game": self.game,
                "platform": self.platform,
            },
        )
        resp = self.client.post(
            url,
            {"platform": "mobile"},
        )

        self.assertEqual(resp.status_code, 400)
        self.assertEqual(Team.objects.count(), 0)

    def test_list_teams_200(self):
        """
        Ensure we can list teams.
        """

        Team.objects.create(
            name="test team 1",
            created_by=self.user,
        )

        url = reverse(
            "team-list",
            kwargs={
                "platform": self.platform,
                "game": self.game,
            },
        )
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.json()), 1)

        # # When it returns an empty list
        # url = reverse(
        #     "team-list",
        #     kwargs={
        #         "platform": "fake-platform-slug",
        #         "game": "fake-game-slug",
        #     },
        # )

        # resp = self.client.get(url)

        # self.assertEqual(resp.status_code, 200)
        # self.assertEqual(len(resp.json()), 0)
