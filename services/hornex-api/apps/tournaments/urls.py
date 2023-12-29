from django.urls import path

from apps.tournaments.views import (
    TournamentReadOnlyViewSet,
    TournamentRegistrationViewSet,
    TournamentViewSet,
)

urlpatterns = [
    path(
        "/<str:platform>/<str:game>/tournaments",
        TournamentReadOnlyViewSet.as_view({"get": "list"}),
        name="tournament-list",
    ),
    path(
        "/<str:platform>/<str:game>/tournaments/<str:id>/details",
        TournamentViewSet.as_view({"get": "retrieve"}),
        name="tournament-details",
    ),
    path(
        "/<str:platform>/<str:game>/tournaments/<str:id>/register",
        TournamentRegistrationViewSet.as_view({"post": "register"}),
        name="tournament-register",
    ),
    path(
        "/registrations/<str:id>",
        TournamentRegistrationViewSet.as_view({"get": "retrieve"}),
        name="tournament-registration-details",
    ),
]
