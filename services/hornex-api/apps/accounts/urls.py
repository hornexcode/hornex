from django.urls import path

from apps.accounts.views import oauth_login, oauth_login_callback

urlpatterns = [
    path(
        "/league-of-legends/oauth/login",
        oauth_login,
        name="riot-oauth-login",
    ),
    path(
        "/league-of-legends/oauth/login/callback",
        oauth_login_callback,
        name="riot-oauth-callback",
    ),
]
