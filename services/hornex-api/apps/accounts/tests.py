from unittest.mock import patch, MagicMock
from django.urls import include, path, reverse
from django.utils.http import urlencode
from rest_framework.test import APITestCase, URLPatternsTestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import LeagueOfLegendsAccount, User
from test.factories import TierFactory, LeagueOfLegendsAccountFactory


class TestAccountsRiot(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path(f"/riot", include("apps.accounts.riot.urls")),
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
        
        self.tier = TierFactory.new(name="fake-tier")


    @patch("requests.post")
    @patch("requests.get")
    def test_connect_riot_account_200(self, mock_post, mock_get):
        """
        Ensure an logged user can connect his riot account.
        """
        
        mock_get_response = MagicMock()
        mock_post_response = MagicMock()
        mock_post_response.status_code = 200
        mock_get_response.status_code = 200
        mock_post_response.json.return_value = {}
        mock_get_response.json.side_effect = [{
            "access_token":"fake-token",
            "refresh_token":"fake-refresh-token",
            "scope":"openid offline_access",
            "id_token":"fake-id-token",
            "token_type":"Bearer",
            "expires_in":3600
        },
            {"sub":"fake-sub", "jti":"fake-jti"},
            {"puuid":"fake-ppuid", "gameName":"Celus O recomeço", "tagLine":"BR1"},
            {"id":"KiLBNzFOXLhkfMASBcLR9WLZl7GzRjMhaE4Kix3fFwsx5g", "accountId":"olKDYHY6sTJIrl4KuvOlaHrM-lhIIgQySXDXR7fzGeE", "puuid":"fake-ppuid", "name":"Celus O recomeço", "profileIconId":545, "revisionDate":1699057103000, "summonerLevel":79},
            [{"tier": "fake-tier"}],
        ]
        mock_post.return_value = mock_get_response
        mock_get.return_value = mock_get_response
        
        query_string = urlencode({"code": "fake-code"})
        base_url = reverse("riot-oauth-callback")
        url = f"{base_url}?{query_string}"
        
        resp = self.client.get(url)
        
        self.assertEqual(resp.data.get("access_token"), "fake-token")
        self.assertEqual(resp.data.get("refresh_token"), "fake-refresh-token")
        self.assertEqual(LeagueOfLegendsAccount.objects.count(), 1)
        
    @patch("requests.post")
    @patch("requests.get")
    def test_update_riot_account_200(self, mock_post, mock_get):
        """
        Ensure an logged user can connect his riot account.
        """
        
        self.user.leagueoflegendsaccount = LeagueOfLegendsAccountFactory.new(user=User.objects.get(email=self.user.email))
        
        mock_get_response = MagicMock()
        mock_post_response = MagicMock()
        mock_post_response.status_code = 200
        mock_get_response.status_code = 200
        mock_post_response.json.return_value = {}
        mock_get_response.json.side_effect = [{
            "access_token":"fake-token",
            "refresh_token":"fake-refresh-token",
            "scope":"openid offline_access",
            "id_token":"fake-id-token",
            "token_type":"Bearer",
            "expires_in":3600
        },
            {"sub":"fake-sub", "jti":"fake-jti"},
            {"puuid":"fake-ppuid", "gameName":"Celus O recomeço", "tagLine":"BR1"},
            {"id":"KiLBNzFOXLhkfMASBcLR9WLZl7GzRjMhaE4Kix3fFwsx5g", "accountId":"olKDYHY6sTJIrl4KuvOlaHrM-lhIIgQySXDXR7fzGeE", "puuid":"fake-ppuid", "name":"Celus O recomeço", "profileIconId":545, "revisionDate":1699057103000, "summonerLevel":79},
            [{"tier": "fake-tier"}],
        ]
        mock_post.return_value = mock_get_response
        mock_get.return_value = mock_get_response
        
        query_string = urlencode({"code": "fake-code"})
        base_url = reverse("riot-oauth-callback")
        url = f"{base_url}?{query_string}"
        
        resp = self.client.get(url)
        
        self.assertEqual(resp.data.get("access_token"), "fake-token")
        self.assertEqual(resp.data.get("refresh_token"), "fake-refresh-token")
        self.assertEqual(LeagueOfLegendsAccount.objects.count(), 1)   

        
    def test_connect_riot_account_401(self):
        """
        Non logged in user tries to connect his riot account.
        """
        self.client.credentials()
        
        query_string = urlencode({"code": "fake-code"})
        base_url = reverse("riot-oauth-callback")
        url = f"{base_url}?{query_string}"
        
        resp = self.client.get(url)
        
        self.assertEquals(resp.status_code, 401)
        
    @patch("requests.post")
    def test_connect_riot_account_400(self, mock_post):
        """
        Ensure an logged user can connect his riot account.
        """
        
        mock_post_response = MagicMock()
        mock_post_response.status_code = 200
        mock_post_response.side_effect = Exception
        
        query_string = urlencode({"code": "fake-code"})
        base_url = reverse("riot-oauth-callback")
        url = f"{base_url}?{query_string}"
        
        resp = self.client.get(url)
        
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(LeagueOfLegendsAccount.objects.count(), 0)
        
    @patch("requests.post")
    def test_connect_riot_account_400(self, mock_post):
        """
        Ensure an logged user can connect his riot account.
        """
        
        mock_post_response = MagicMock()
        mock_post_response.status_code = 200
        mock_post_response.side_effect = Exception
        
        query_string = urlencode({"code": "fake-code"})
        base_url = reverse("riot-oauth-callback")
        url = f"{base_url}?{query_string}"
        
        resp = self.client.get(url)
        
        self.assertEqual(resp.status_code, 400)
        self.assertEqual(LeagueOfLegendsAccount.objects.count(), 0)