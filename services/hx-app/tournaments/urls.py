from django.urls import path
from tournaments.views import TournamentReadOnlyViewSet, TournamentViewSet


urlpatterns = [
    path(
        "", TournamentReadOnlyViewSet.as_view({"get": "list"}), name="tournament-list"
    ),
    path(
        "/<str:id>",
        TournamentViewSet.as_view({"get": "retrieve"}),
        name="tournament-details",
    ),
    path(
        "/<str:id>/register",
        TournamentViewSet.as_view({"post": "register", "delete": "unregister"}),
        name="tournament-register",
    ),
]
