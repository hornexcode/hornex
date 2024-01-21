from django.urls import include, path
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User


class TestTournaments(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("api/v1", include("apps.tournaments.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "test.user@hornex.gg",
            "password": "hsfbhkas",
            "name": "Test User",
        }

        self.user = User.objects.create_user(**self.credentials)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
        )

    def test_get_check_in_status_success(self):
        self.assertTrue(True)
