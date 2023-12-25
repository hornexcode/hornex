from django.urls import path

from apps.leagueoflegends.views import riot_connect_account, riot_oauth_callback

urlpatterns = [
    path(
        "/account-connect",
        riot_connect_account,
    ),
    path("/webhooks/oauth2/callback", riot_oauth_callback, name="riot-oauth-callback"),
]
