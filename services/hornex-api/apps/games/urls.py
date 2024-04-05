from django.urls import path

from apps.games.views import GameViewSet

urlpatterns = [
    path("", GameViewSet.as_view({"get": "list"}), name="game-list"),
    path(
        "/<str:id>/details",
        GameViewSet.as_view({"get": "retrieve"}),
        name="game-details",
    ),
]
