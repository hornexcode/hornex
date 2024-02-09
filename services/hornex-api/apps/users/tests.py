from django.urls import include, path, reverse
from rest_framework.serializers import ValidationError
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import User


class TestUsers(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("api/v1/users", include("apps.users.urls")),
    ]

    def setUp(self):
        self.credentials = {
            "email": "test@test.com",
            "password": "123456tb",
            "name": "Testator",
        }

        self.user = User.objects.create_user(**self.credentials)

        # Generating a JWT token for the test user
        self.refresh = RefreshToken.for_user(self.user)

        # Authenticate the client with the token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}")

    def test_create_user_201(self):
        url = reverse("register-user")
        user = {
            "email": "test@hornex.gg",
            "password": "123456tb",
            "password2": "123456tb",
            "first_name": "Tester",
            "last_name": "Testing",
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
            "password": "123456tb",
            "password2": "123456tbi",
            "first_name": "Tester",
            "last_name": "Testing",
        }
        resp = self.client.post(url, user)

        self.assertEqual(resp.status_code, 400)
        self.assertRaises(ValidationError)
        self.assertEqual(resp.data["password"][0], "Password fields didn't match.")

    def test_create_user_password_invalid_400(self):
        url = reverse("register-user")
        user = {
            "email": "test@hornex.gg",
            "password": "123",
            "password2": "123",
            "first_name": "Tester",
            "last_name": "Testing",
        }
        resp = self.client.post(url, user)

        self.assertEqual(resp.status_code, 400)
        self.assertRaises(ValidationError)
        self.assertEqual(
            resp.data["password"][0],
            "This password is too short. It must contain at least 8 characters.",
        )
        self.assertEqual(resp.data["password"][1], "This password is too common.")
        self.assertEqual(resp.data["password"][2], "This password is entirely numeric.")

    def test_get_user_current_user_200(self):
        url = reverse("current-user")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp.data["name"], "Testator")

    def test_get_user_current_user_not_logged_in_401(self):
        url = reverse("current-user")
        self.client.credentials(HTTP_AUTHORIZATION="Bearer 157")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.data["code"], "token_not_valid")
