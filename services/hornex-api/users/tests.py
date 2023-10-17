from django.urls import include, path, reverse
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.serializers import ValidationError

from users.models import User


class UsersTests(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("api/v1/users", include("users.urls")),
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

    def test_create_user_201(self):
        url = reverse("register-user")
        user = {
            "email": "test@hornex.gg",
            "password": "123",
            "password2": "123",
            "first_name": "Herbert",
            "last_name": "Araújo",
        }
        resp = self.client.post(url, user)

        self.assertEqual(resp.status_code, 201)
        self.assertEqual(resp.data["name"], f"{user['first_name']} {user['last_name']}")
        self.assertEqual(User.objects.count(), 2)

    def test_create_user_required_fields_400(self):
        url = reverse("register-user")
        user = {}
        resp = self.client.post(url, user)

        self.assertEqual(resp.status_code, 400)
        self.assertRaises(ValidationError)
        self.assertEqual(resp.data["email"][0], "This field is required.")
        self.assertEqual(resp.data["first_name"][0], "This field is required.")
        self.assertEqual(resp.data["last_name"][0], "This field is required.")
        self.assertEqual(resp.data["password"][0], "This field is required.")
        self.assertEqual(resp.data["password2"][0], "This field is required.")

    def test_create_user_password_must_match_400(self):
        url = reverse("register-user")
        user = {
            "email": "test@hornex.gg",
            "password": "123",
            "password2": "1234",
            "first_name": "Herbert",
            "last_name": "Araújo",
        }
        resp = self.client.post(url, user)

        self.assertEqual(resp.status_code, 400)
        self.assertRaises(ValidationError)
        self.assertEqual(resp.data["password"][0], "Password fields didn't match.")
