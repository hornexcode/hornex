from django.urls import path

from apps.games.views import GameIDViewSet, GameViewSet

urlpatterns = [
    path("", GameViewSet.as_view({"get": "list"}), name="game-list"),
    path("/game-ids", GameIDViewSet.as_view({"get": "list"}), name="game-ids-list"),
    path(
        "/<str:id>/details",
        GameViewSet.as_view({"get": "retrieve"}),
        name="game-details",
    ),
]
