from django.urls import path

from apps.accounts.views import GameIDViewSet, ProfileViewSet, oauth_login, oauth_login_callback

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
        "/profiles",
        ProfileViewSet.as_view({"post": "create", "get": "list"}),
        name="profiles-controller",
    ),
    path(
        "/profiles/<str:id>",
        ProfileViewSet.as_view({"patch": "partial_update", "get": "retrieve", "delete": "delete"}),
        name="profiles-details-controller",
    ),
    path(
        "/game-ids",
        GameIDViewSet.as_view({"get": "list"}),
        name="game-ids",
    ),
]
