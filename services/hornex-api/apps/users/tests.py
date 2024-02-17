from django.urls import include, path, reverse
from rest_framework.serializers import ValidationError
from rest_framework.test import APITestCase, URLPatternsTestCase

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

    def test_create_user_201(self):
        url = reverse("sign-up")
        user = {
            "email": "test@hornex.gg",
            "password": "123456tb",
            "name": "Testing",
        }
        resp = self.client.post(url, user)

        self.assertEqual(resp.status_code, 201)
        self.assertEqual(User.objects.count(), 1)

    def test_create_user_required_fields_400(self):
        url = reverse("sign-up")
        user = {}
        resp = self.client.post(url, user)

        self.assertEqual(resp.status_code, 400)
        self.assertRaises(ValidationError)
        self.assertEqual(resp.data["email"][0], "This field is required.")
        self.assertEqual(resp.data["password"][0], "This field is required.")

    def test_create_user_password_invalid_400(self):
        url = reverse("sign-up")
        user = {
            "email": "test@hornex.gg",
            "password": "123",
            "name": "Testing",
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

    def test_get_user_current_user_not_logged_in_401(self):
        url = reverse("current-user")
        self.client.credentials(HTTP_AUTHORIZATION="Bearer 157")
        resp = self.client.get(url)

        self.assertEqual(resp.status_code, 401)
        self.assertEqual(resp.data["code"], "token_not_valid")
