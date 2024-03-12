import faker
from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User

fake = faker.Faker()


class ProfileTest(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("/accounts", include("apps.accounts.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "testuser",
            "password": "testpass",
        }

        self.user = User.objects.create_user(**self.credentials)

        self.refresh = RefreshToken.for_user(self.user)

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

    def test_create_profile(self):
        url = reverse("profiles-controller")

        payload = {
            "user": self.user.id,
            "discord_link": "https://www.discord.com/test",
            "twitter_link": "https://www.twitter.com/test",
            "twitch_link": "https://www.twitch.tv/test",
        }

        resp = self.client.post(
            url,
            payload,
        )

        profile = resp.json()

        self.assertEqual(profile.get("user"), str(self.user.id))
        self.assertEqual(profile.get("discord_link"), payload.get("discord_link"))
        self.assertEqual(profile.get("twitter_link"), payload.get("twitter_link"))
        self.assertEqual(profile.get("twitch_link"), payload.get("twitch_link"))
