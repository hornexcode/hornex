from django.urls import path

from apps.tournaments.views import (
    OrganizerTournamentViewSet,
    PublicTournamentViewSet,
    TournamentRegistrationViewSet,
    check_in,
    create_and_register_team,
    participant_checked_in,
    register_team,
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
        "/organizer/tournaments/<str:uuid>",
        OrganizerTournamentViewSet.as_view({"patch": "partial_update"}),
        name="details",
    ),
    path(
        "/organizer/tournaments/<str:uuid>/start",
        OrganizerTournamentViewSet.as_view({"post": "start"}),
        name="details",
    ),
    # web
    path(
        "/tournaments/<str:uuid>/registrations",
        TournamentRegistrationViewSet.as_view({"post": "register", "get": "list"}),
        name="register",
    ),
    path(
        "/tournaments/<str:uuid>/teams",
        PublicTournamentViewSet.as_view({"get": "teams"}),
        name="registered-teams",
    ),
    path(
        "/tournaments/<str:uuid>/participants",
        PublicTournamentViewSet.as_view({"get": "participants"}),
        name="list-participants",
    ),
    path(
        "/tournaments/<str:uuid>/prizes",
        PublicTournamentViewSet.as_view({"get": "prizes"}),
        name="list-prizes",
    ),
    path(
        "/registrations/<str:uuid>",
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
        participant_checked_in,
        name="participant-checked-in",
    ),
    path(
        "/<str:platform>/<str:game>/tournaments",
        PublicTournamentViewSet.as_view({"get": "list"}),
        name="list",
    ),
    # Returns details of a tournament
    path(
        "/<str:platform>/<str:game>/tournaments/<str:uuid>/details",
        PublicTournamentViewSet.as_view({"get": "retrieve"}),
        name="details",
    ),
    path(
        "/tournaments/<str:uuid>/registered-teams",
        PublicTournamentViewSet.as_view({"get": "list_registered_teams"}),
        name="list-registered-teams",
    ),
    path(
        "/tournaments/<str:uuid>/register-team",
        register_team,
        name="register_team",
    ),
    path(
        "/tournaments/<str:uuid>/create-and-register-team",
        create_and_register_team,
        name="create_and_register_team",
    ),
    # TEST_MODE
]
