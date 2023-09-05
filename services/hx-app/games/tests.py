from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from games.models import Game
from platforms.models import Platform


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

    def test_connect_account_204(self):
        url = reverse("game-account", kwargs={"id": self.game.id})
        resp = self.client.post(url, {"name": "Celus o recomeço", "region": "BR1"})

        self.assertEqual(resp.status_code, 204)

    def test_connect_account_400_name_or_region_not_sent(self):
        url = reverse("game-account", kwargs={"id": self.game.id})

        resp = self.client.post(url, {"region": "BR1"})
        self.assertEqual(resp.status_code, 400)

        resp = self.client.post(url, {"name": "Celus o recomeço"})
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

    def test_connect_account_400_fake_summoner_name(self):
        url = reverse("game-account", kwargs={"id": self.game.id})
        resp = self.client.post(url, {"name": "fake-summoner-name", "region": "BR1"})

        self.assertEqual(resp.status_code, 400)
