from django.urls import path

from apps.games.views import GameViewSet, create_game_account

urlpatterns = [
    path("", GameViewSet.as_view({"get": "list"}), name="game-list"),
    path("/<str:id>", GameViewSet.as_view({"get": "retrieve"}), name="game-details"),
    path(
        "/<str:id>/accounts/connect",
        create_game_account,
        name="game-account",
    ),
]
