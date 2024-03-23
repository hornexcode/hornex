from django.urls import path

from apps.accounts.views import (
    GameIDViewSet,
    oauth_login,
    oauth_login_callback,
    profile,
)

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
    path(
        "/game-ids",
        GameIDViewSet.as_view({"get": "list"}),
        name="game-ids",
    ),
    path(
        "/game-ids/<str:id>/disconnect",
        GameIDViewSet.as_view({"delete": "disconnect"}),
        name="disonnect-gameid",
    ),
    path(
        "/profile",
        profile,
        name="profile",
    ),
]
