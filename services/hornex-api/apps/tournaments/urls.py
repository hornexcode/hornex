from django.urls import path

from apps.tournaments.views import (
    TournamentReadOnlyViewSet,
    TournamentRegistrationViewSet,
    TournamentViewSet,
    check_in,
    pariticipant_checked_in,
    team_check_in_status,
)

# set namespace
app_name = "tournaments"

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
        "/registrations",
        TournamentRegistrationViewSet.as_view({"get": "list"}),
        name="tournament-registration-list",
    ),
    path(
        "/registrations/<str:id>",
        TournamentRegistrationViewSet.as_view({"get": "retrieve"}),
        name="tournament-registration-details",
    ),
    path(
        "/tournaments/<str:tournament>/teams/<str:team>/check-in",
        check_in,
        name="check-in",
    ),
    path(
        "/tournaments/<str:tournament>/teams/<str:team>/check-in/status",
        team_check_in_status,
        name="check-in-status",
    ),
    path(
        "/tournaments/<str:tournament>/participant/checked-in",
        pariticipant_checked_in,
        name="participant-checked-in",
    ),
]
