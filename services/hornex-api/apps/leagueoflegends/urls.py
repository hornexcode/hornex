from django.urls import path

from apps.leagueoflegends.views import oauth_login, oauth_login_callback

urlpatterns = [
    path(
        "/oauth/login",
        oauth_login,
    ),
    path(
        "/oauth/login/callback",
        oauth_login_callback,
        name="riot-oauth-callback",
    ),
]
