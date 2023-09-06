from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from games.models import Game
from platforms.models import Platform
from mock import patch, Mock
from services.riot.client import Client
from services.riot import exceptions
from requests.exceptions import HTTPError
from rest_framework import status
from requests.models import Response


class GameTests(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("api/v1/games", include("games.urls")),
    ]

    def test_list_200(self):
        self.platform = Platform.objects.create(name="test platform")
        self.game = Game.objects.create(name="test game")
        self.game.platforms.set([self.platform])

        url = reverse("game-list")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(len(resp.data), 1)


class GameAccountRiotTests(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("api/v1/games", include("games.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.refresh = RefreshToken.for_user(self.user)

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

        self.platform = Platform.objects.create(name="test platform")
        # League of Legends because of the if statement game.slug == "league-of-legends"
        self.game = Game.objects.create(name="League of Legends")
        self.game.platforms.set([self.platform])
        self.url = reverse("game-account", kwargs={"id": self.game.id})

    @patch.object(
        Client,
        "get_a_summoner_by_summoner_name",
        return_value={
            "id": "fake-id",
            "accountId": "fake-account-id",
            "puuid": "fake-puuid",
            "name": "Celus o recomeço",
            "profileIconId": 456,
            "revisionDate": 1627777777777,
            "summonerLevel": 123,
        },
    )
    def test_connect_account_204(self, mock_get_a_summoner_by_summoner_name):
        resp = self.client.post(self.url, {"name": "Celus o recomeço", "region": "BR1"})

        self.assertEqual(resp.status_code, 204)
        self.assertEqual(resp.data["message"], "Account created")
        mock_get_a_summoner_by_summoner_name.assert_called_once_with(
            "Celus o recomeço", "BR1"
        )

    def test_connect_account_400_name_or_region_not_sent(self):
        resp = self.client.post(self.url, {"region": "BR1"})
        self.assertEqual(resp.status_code, 400)

        resp = self.client.post(self.url, {"name": "Celus o recomeço"})
        self.assertEqual(resp.status_code, 400)

    def test_connect_account_404_invalid_uuid(self):
        url = reverse("game-account", kwargs={"id": "invalid_uuid"})
        resp = self.client.post(url, {"name": "Celus o recomeço", "region": "BR1"})

        self.assertEqual(resp.status_code, 404)

    def test_connect_account_404_invalid_game(self):
        url = reverse(
            "game-account", kwargs={"id": "b8941eaa-22dd-4478-948c-78657caf1591"}
        )
        resp = self.client.post(url, {"name": "Celus o recomeço", "region": "BR1"})

        self.assertEqual(resp.status_code, 404)

    @patch.object(Client, "get_a_summoner_by_summoner_name")
    def test_connect_account_404_wrong_summoner_name(
        self, mock_get_a_summoner_by_summoner_name
    ):
        mock_response = Mock(spec=Response)
        mock_response.status_code = 404

        http_error = HTTPError()
        http_error.response = mock_response

        mock_get_a_summoner_by_summoner_name.side_effect = http_error

        resp = self.client.post(
            self.url, {"name": "fake-summoner-name", "region": "BR1"}
        )

        self.assertEqual(resp.status_code, 404)
        mock_get_a_summoner_by_summoner_name.assert_called_once_with(
            "fake-summoner-name", "BR1"
        )

    @patch.object(
        Client,
        "get_a_summoner_by_summoner_name",
        side_effect=exceptions.RiotApiError(f"Invalid region: fake-region", 400),
    )
    def test_connect_account_400_wrong_region(
        self, mock_get_a_summoner_by_summoner_name
    ):
        resp = self.client.post(
            self.url, {"name": "Celus o recomeço", "region": "fake-region"}
        )

        self.assertEqual(resp.status_code, 400)
        mock_get_a_summoner_by_summoner_name.assert_called_once_with(
            "Celus o recomeço", "fake-region"
        )
