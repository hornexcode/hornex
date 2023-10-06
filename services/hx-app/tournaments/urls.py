from django.urls import path
from tournaments.views import (
    TournamentReadOnlyViewSet,
    TournamentViewSet,
    TournamentRegistrationViewSet,
    LeagueOfLegendsTournamentReadOnlyViewSet,
)


urlpatterns = [
    path(
        "", TournamentReadOnlyViewSet.as_view({"get": "list"}), name="tournament-list"
    ),
    path(
        "/registrations",
        TournamentRegistrationViewSet.as_view({"get": "list"}),
        name="tournament-registration",
    ),
    path(
        "/<str:id>",
        TournamentViewSet.as_view({"get": "retrieve"}),
        name="tournament-details",
    ),
    path(
        "/<str:id>/register",
        TournamentViewSet.as_view({"post": "register", "delete": "cancel"}),
        name="tournament-register",
    ),
    path(
        "/<str:id>/unregister",
        TournamentViewSet.as_view({"delete": "unregister"}),
        name="tournament-unregister",
    ),
    path(
        "/lol/search",
        LeagueOfLegendsTournamentReadOnlyViewSet.as_view({"get": "list"}),
        name="list-tournaments-by-game",
    ),
]
