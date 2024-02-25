from django.urls import path

from apps.tournaments.views import (
    OrganizerTournamentViewSet,
    PublicTournamentViewSet,
    RegistrationViewSet,
    TournamentRegistrationViewSet,
    check_in,
    pariticipant_checked_in,
    team_check_in_status,
)

# set namespace
app_name = "tournaments"

urlpatterns = [
    # organizer
    path(
        "/organizer/tournaments",
        OrganizerTournamentViewSet.as_view({"post": "create", "get": "list"}),
        name="dashboard-tournaments-controller",
    ),
    path(
        "/organizer/tournaments/<str:id>",
        OrganizerTournamentViewSet.as_view({"patch": "partial_update"}),
        name="details",
    ),
    path(
        "/organizer/tournaments/<str:id>/start",
        OrganizerTournamentViewSet.as_view({"post": "start"}),
        name="details",
    ),
    # web
    path(
        "/tournaments/<str:id>/registrations",
        TournamentRegistrationViewSet.as_view({"post": "register"}),
        name="register",
    ),
    path(
        "/tournaments/<str:id>/teams",
        PublicTournamentViewSet.as_view({"get": "teams"}),
        name="registered-teams",
    ),
    path(
        "/tournaments/<str:id>/participants",
        PublicTournamentViewSet.as_view({"get": "participants"}),
        name="list-participants",
    ),
    path(
        "/tournaments/<str:id>/prizes",
        PublicTournamentViewSet.as_view({"get": "prizes"}),
        name="list-prizes",
    ),
    path(
        "/registrations",
        RegistrationViewSet.as_view({"get": "list"}),
        name="list-registrations-for-a-user",
    ),
    path(
        "/registrations/<str:id>",
        TournamentRegistrationViewSet.as_view({"get": "retrieve"}),
        name="registration-details",
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
    path(
        "/<str:platform>/<str:game>/tournaments",
        PublicTournamentViewSet.as_view({"get": "list"}),
        name="list",
    ),
    # Returns details of a tournament
    path(
        "/<str:platform>/<str:game>/tournaments/<str:id>/details",
        PublicTournamentViewSet.as_view({"get": "retrieve"}),
        name="details",
    ),
]
