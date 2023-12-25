# from test.factories import ClassificationFactory, LeagueOfLegendsAccountFactory
# from unittest.mock import MagicMock, patch

# import requests
# from django.urls import include, path, reverse
# from django.utils.http import urlencode
# from rest_framework.test import APITestCase, URLPatternsTestCase
# from rest_framework_simplejwt.tokens import RefreshToken

# from apps.accounts.models import LeagueOfLegendsAccount, User


# class TestAccountsRiot(APITestCase, URLPatternsTestCase):
#     urlpatterns = [
#         path("/riot", include("apps.accounts.riot.urls")),
#     ]

#     def setUp(self):
#         self.credentials = {
#             "email": "testuser",
#             "password": "testpass",
#         }

#         self.user = User.objects.create_user(**self.credentials)

#         # Generating a JWT token for the test user
#         self.refresh = RefreshToken.for_user(self.user)

#         # Authenticate the client with the token
#         self.client.credentials(
#             HTTP_AUTHORIZATION=f"Bearer {self.refresh.access_token}"
#         )

#     @patch("requests.post")
#     @patch("requests.get")
#     def test_connect_riot_account_200(self, mock_post, mock_get):
#         """
#         Ensure an logged user can connect his riot account.
#         """
#         self.classification = ClassificationFactory.new()
#         mock_get_response = MagicMock()
#         mock_post_response = MagicMock()
#         mock_post_response.status_code = 200
#         mock_get_response.status_code = 200
#         mock_post_response.json.return_value = {}
#         mock_get_response.json.side_effect = [
#             {
#                 "access_token": "fake-token",
#                 "refresh_token": "fake-refresh-token",
#                 "scope": "openid offline_access",
#                 "id_token": "fake-id-token",
#                 "token_type": "Bearer",
#                 "expires_in": 3600,
#             },
#             {"sub": "fake-sub", "jti": "fake-jti"},
#             {"puuid": "fake-ppuid", "gameName": "Celus O recomeço", "tagLine": "BR1"},
#             {
#                 "id": "KiLBNzFOXLhkfMASBcLR9WLZl7GzRjMhaE4Kix3fFwsx5g",
#                 "accountId": "olKDYHY6sTJIrl4KuvOlaHrM-lhIIgQySXDXR7fzGeE",
#                 "puuid": "fake-ppuid",
#                 "name": "Celus O recomeço",
#                 "profileIconId": 545,
#                 "revisionDate": 1699057103000,
#                 "summonerLevel": 79,
#             },
#             [{"tier": "SILVER", "rank": "I"}],
#         ]
#         mock_post.return_value = mock_get_response
#         mock_get.return_value = mock_get_response

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.data.get("access_token"), "fake-token")
#         self.assertEqual(resp.data.get("refresh_token"), "fake-refresh-token")
#         self.assertEqual(LeagueOfLegendsAccount.objects.count(), 1)

#     @patch("requests.post")
#     @patch("requests.get")
#     def test_update_riot_account_200(self, mock_post, mock_get):
#         """
#         Ensure an logged user can connect his riot account.
#         """
#         self.classification = ClassificationFactory.new()
#         self.user.leagueoflegendsaccount = LeagueOfLegendsAccountFactory.new(
#             user=User.objects.get(email=self.user.email),
#             classification=self.classification,
#         )
#         self.user.save()

#         mock_get_response = MagicMock()
#         mock_post_response = MagicMock()
#         mock_post_response.status_code = 200
#         mock_get_response.status_code = 200
#         mock_post_response.json.return_value = {}
#         mock_get_response.json.side_effect = [
#             {
#                 "access_token": "fake-token",
#                 "refresh_token": "fake-refresh-token",
#                 "scope": "openid offline_access",
#                 "id_token": "fake-id-token",
#                 "token_type": "Bearer",
#                 "expires_in": 3600,
#             },
#             {"sub": "fake-sub", "jti": "fake-jti"},
#             {"puuid": "fake-ppuid", "gameName": "Celus O recomeço", "tagLine": "BR1"},
#             {
#                 "id": "KiLBNzFOXLhkfMASBcLR9WLZl7GzRjMhaE4Kix3fFwsx5g",
#                 "accountId": "olKDYHY6sTJIrl4KuvOlaHrM-lhIIgQySXDXR7fzGeE",
#                 "puuid": "fake-ppuid",
#                 "name": "Celus O recomeço",
#                 "profileIconId": 545,
#                 "revisionDate": 1699057103000,
#                 "summonerLevel": 79,
#             },
#             [{"tier": "SILVER", "rank": "I"}],
#         ]
#         mock_post.return_value = mock_get_response
#         mock_get.return_value = mock_get_response

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.data.get("access_token"), "fake-token")
#         self.assertEqual(resp.data.get("refresh_token"), "fake-refresh-token")
#         self.assertEqual(LeagueOfLegendsAccount.objects.count(), 1)

#     def test_connect_riot_account_401(self):
#         """
#         Non logged in user tries to connect his riot account.
#         """
#         self.client.credentials()

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.status_code, 401)

#     @patch("requests.post")
#     def test_connect_riot_account_400(self, mock_post):
#         """
#         It can not retrieve token.
#         """

#         mock_post_response = MagicMock()
#         mock_post_response.status_code = 200
#         mock_post_response.side_effect = Exception

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.status_code, 400)
#         self.assertEqual(LeagueOfLegendsAccount.objects.count(), 0)

#     @patch("requests.post")
#     @patch("requests.get")
#     def test_update_riot_account_400_no_userinfo(self, mock_post, mock_get):
#         """
#         It could not find userinfo.
#         """
#         mock_post_response = MagicMock()
#         mock_get_response = MagicMock()
#         mock_post_response.status_code = 200
#         mock_get_response.status_code = 200
#         mock_post_response.json.return_value = {}
#         mock_get_response.json.side_effect = [
#             {
#                 "access_token": "fake-token",
#                 "refresh_token": "fake-refresh-token",
#                 "scope": "openid offline_access",
#                 "id_token": "fake-id-token",
#                 "token_type": "Bearer",
#                 "expires_in": 3600,
#             },
#             requests.RequestException,
#         ]
#         mock_post.return_value = mock_get_response
#         mock_get.return_value = mock_get_response

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.status_code, 400)
#         self.assertEqual(LeagueOfLegendsAccount.objects.count(), 0)

#     @patch("requests.post")
#     @patch("requests.get")
#     def test_update_riot_account_400_account(self, mock_post, mock_get):
#         """
#         accounts/me raises exception.
#         """
#         mock_post_response = MagicMock()
#         mock_get_response = MagicMock()
#         mock_post_response.status_code = 200
#         mock_get_response.status_code = 200
#         mock_post_response.json.return_value = {}
#         mock_get_response.json.side_effect = [
#             {
#                 "access_token": "fake-token",
#                 "refresh_token": "fake-refresh-token",
#                 "scope": "openid offline_access",
#                 "id_token": "fake-id-token",
#                 "token_type": "Bearer",
#                 "expires_in": 3600,
#             },
#             {"sub": "fake-sub", "jti": "fake-jti"},
#             requests.RequestException,
#         ]
#         mock_post.return_value = mock_get_response
#         mock_get.return_value = mock_get_response

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.status_code, 400)
#         self.assertEqual(LeagueOfLegendsAccount.objects.count(), 0)

#     @patch("requests.post")
#     @patch("requests.get")
#     def test_update_riot_account_400_summoner(self, mock_post, mock_get):
#         """
#         summoner/me raises exception.
#         """
#         mock_post_response = MagicMock()
#         mock_get_response = MagicMock()
#         mock_post_response.status_code = 200
#         mock_get_response.status_code = 200
#         mock_post_response.json.return_value = {}
#         mock_get_response.json.side_effect = [
#             {
#                 "access_token": "fake-token",
#                 "refresh_token": "fake-refresh-token",
#                 "scope": "openid offline_access",
#                 "id_token": "fake-id-token",
#                 "token_type": "Bearer",
#                 "expires_in": 3600,
#             },
#             {"sub": "fake-sub", "jti": "fake-jti"},
#             {"puuid": "fake-ppuid", "gameName": "Celus O recomeço", "tagLine": "BR1"},
#             requests.RequestException,
#         ]
#         mock_post.return_value = mock_get_response
#         mock_get.return_value = mock_get_response

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.status_code, 400)
#         self.assertEqual(LeagueOfLegendsAccount.objects.count(), 0)

#     @patch("requests.post")
#     @patch("requests.get")
#     def test_update_riot_account_400_entries(self, mock_post, mock_get):
#         """
#         Get entires raises exception.
#         """
#         mock_post_response = MagicMock()
#         mock_get_response = MagicMock()
#         mock_post_response.status_code = 200
#         mock_get_response.status_code = 200
#         mock_post_response.json.return_value = {}
#         mock_get_response.json.side_effect = [
#             {
#                 "access_token": "fake-token",
#                 "refresh_token": "fake-refresh-token",
#                 "scope": "openid offline_access",
#                 "id_token": "fake-id-token",
#                 "token_type": "Bearer",
#                 "expires_in": 3600,
#             },
#             {"sub": "fake-sub", "jti": "fake-jti"},
#             {"puuid": "fake-ppuid", "gameName": "Celus O recomeço", "tagLine": "BR1"},
#             {
#                 "id": "KiLBNzFOXLhkfMASBcLR9WLZl7GzRjMhaE4Kix3fFwsx5g",
#                 "accountId": "olKDYHY6sTJIrl4KuvOlaHrM-lhIIgQySXDXR7fzGeE",
#                 "puuid": "fake-ppuid",
#                 "name": "Celus O recomeço",
#                 "profileIconId": 545,
#                 "revisionDate": 1699057103000,
#                 "summonerLevel": 79,
#             },
#             requests.RequestException,
#         ]
#         mock_post.return_value = mock_get_response
#         mock_get.return_value = mock_get_response

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.status_code, 400)
#         self.assertEqual(LeagueOfLegendsAccount.objects.count(), 0)

#     @patch("requests.post")
#     @patch("requests.get")
#     def test_update_riot_account_400_empty_entries(self, mock_post, mock_get):
#         """
#         Get entires returns zero leagues.
#         """
#         mock_post_response = MagicMock()
#         mock_get_response = MagicMock()
#         mock_post_response.status_code = 200
#         mock_get_response.status_code = 200
#         mock_post_response.json.return_value = {}
#         mock_get_response.json.side_effect = [
#             {
#                 "access_token": "fake-token",
#                 "refresh_token": "fake-refresh-token",
#                 "scope": "openid offline_access",
#                 "id_token": "fake-id-token",
#                 "token_type": "Bearer",
#                 "expires_in": 3600,
#             },
#             {"sub": "fake-sub", "jti": "fake-jti"},
#             {"puuid": "fake-ppuid", "gameName": "Celus O recomeço", "tagLine": "BR1"},
#             {
#                 "id": "KiLBNzFOXLhkfMASBcLR9WLZl7GzRjMhaE4Kix3fFwsx5g",
#                 "accountId": "olKDYHY6sTJIrl4KuvOlaHrM-lhIIgQySXDXR7fzGeE",
#                 "puuid": "fake-ppuid",
#                 "name": "Celus O recomeço",
#                 "profileIconId": 545,
#                 "revisionDate": 1699057103000,
#                 "summonerLevel": 79,
#             },
#             [],
#         ]
#         mock_post.return_value = mock_get_response
#         mock_get.return_value = mock_get_response

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.status_code, 400)
#         self.assertEqual(LeagueOfLegendsAccount.objects.count(), 0)

#     @patch("requests.post")
#     @patch("requests.get")
#     def test_update_riot_account_400_missing_classification(self, mock_post, mock_get):
#         """
#         Get entires returns a classification that are not at db.
#         """
#         mock_post_response = MagicMock()
#         mock_get_response = MagicMock()
#         mock_post_response.status_code = 200
#         mock_get_response.status_code = 200
#         mock_post_response.json.return_value = {}
#         mock_get_response.json.side_effect = [
#             {
#                 "access_token": "fake-token",
#                 "refresh_token": "fake-refresh-token",
#                 "scope": "openid offline_access",
#                 "id_token": "fake-id-token",
#                 "token_type": "Bearer",
#                 "expires_in": 3600,
#             },
#             {"sub": "fake-sub", "jti": "fake-jti"},
#             {"puuid": "fake-ppuid", "gameName": "Celus O recomeço", "tagLine": "BR1"},
#             {
#                 "id": "KiLBNzFOXLhkfMASBcLR9WLZl7GzRjMhaE4Kix3fFwsx5g",
#                 "accountId": "olKDYHY6sTJIrl4KuvOlaHrM-lhIIgQySXDXR7fzGeE",
#                 "puuid": "fake-ppuid",
#                 "name": "Celus O recomeço",
#                 "profileIconId": 545,
#                 "revisionDate": 1699057103000,
#                 "summonerLevel": 79,
#             },
#             [{"tier": "PLATINUM", "rank": "II"}],
#         ]
#         mock_post.return_value = mock_get_response
#         mock_get.return_value = mock_get_response

#         query_string = urlencode({"code": "fake-code"})
#         base_url = reverse("riot-oauth-callback")
#         url = f"{base_url}?{query_string}"

#         resp = self.client.get(url)

#         self.assertEqual(resp.status_code, 500)
#         self.assertEqual(LeagueOfLegendsAccount.objects.count(), 0)
