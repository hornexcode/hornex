from django.urls import path

from apps.tournaments.views import (
    OrganizerMatchViewSet,
    OrganizerTournamentViewSet,
    PublicTournamentViewSet,
    RegistrationViewSet,
    TournamentRegistrationViewSet,
    check_in,
    check_in_tournament,
    create_and_register_team,
    participant_checked_in,
    register_team,
    team_check_in_status,
)

# set namespace
app_name = "tournaments"

urlpatterns = [
    # Organizer Resources
    path(
        "/org/tournaments",
        OrganizerTournamentViewSet.as_view({"post": "create", "get": "list"}),
        name="dashboard-tournaments-controller",
    ),
    path(
        "/org/tournaments/<str:id>",
        OrganizerTournamentViewSet.as_view({"patch": "partial_update", "get": "retrieve"}),
        name="details",
    ),
    path(
        "/org/tournaments/<str:id>/start",
        OrganizerTournamentViewSet.as_view({"post": "start"}),
        name="start",
    ),
    path(
        "/org/tournaments/<str:id>/registered-teams",
        OrganizerTournamentViewSet.as_view({"get": "registered_teams"}),
        name="registered-teams",
    ),
    path(
        "/org/tournaments/<str:id>/registrations",
        OrganizerTournamentViewSet.as_view({"get": "registrations"}),
        name="registrations",
    ),
    path(
        "/org/tournaments/<str:id>/registered-teams/<str:team_id>/delete",
        OrganizerTournamentViewSet.as_view({"delete": "delete_registered_team"}),
        name="delete-registered-teams",
    ),
    path(
        "/org/tournaments/<str:id>/matches",
        OrganizerTournamentViewSet.as_view({"get": "matches"}),
        name="list-matches",
    ),
    path(
        "/org/tournaments/<str:id>/end-round",
        OrganizerTournamentViewSet.as_view({"post": "end_round"}),
        name="end_round",
    ),
    path(
        "/org/tournaments/<str:id>/matches/<str:match_id>/start",
        OrganizerTournamentViewSet.as_view({"patch": "start_match"}),
        name="start-match",
    ),
    path(
        "/org/tournaments/<str:id>/matches/<str:match_id>/end",
        OrganizerTournamentViewSet.as_view({"patch": "end_match"}),
        name="end-match",
    ),
    path(
        "/org/tournaments/<str:id>/finalize",
        OrganizerTournamentViewSet.as_view({"patch": "end_tournament"}),
        name="end-tournament",
    ),
    path(
        "/org/tournaments/<str:id>/results",
        OrganizerTournamentViewSet.as_view({"get": "results"}),
        name="results",
    ),
    path(
        "/org/registrations/<str:id>/delete",
        RegistrationViewSet.as_view({"delete": "destroy"}),
        name="delete-registered-teams",
    ),
    path(
        "/org/tournaments/<str:id>/check-in",
        check_in_tournament,
        name="check-in_tournament",
    ),
    # Public Tournament Resources
    path(
        "/tournaments/<str:id>/registrations",
        TournamentRegistrationViewSet.as_view({"post": "register", "get": "list"}),
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
        "/tournaments/<str:id>/standings",
        PublicTournamentViewSet.as_view({"get": "standings"}),
        name="list-prizes",
    ),
    # Registrations Resource
    path(
        "/registrations/<str:id>",
        TournamentRegistrationViewSet.as_view({"get": "retrieve"}),
        name="registration-details",
    ),
    path(
        "/registrations",
        RegistrationViewSet.as_view({"get": "list"}),
        name="registrations",
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
        "/<str:platform>/<str:game>/tournaments/<str:id>/details",
        PublicTournamentViewSet.as_view({"get": "retrieve"}),
        name="details",
    ),
    path(
        "/tournaments/<str:id>/registered-teams",
        PublicTournamentViewSet.as_view({"get": "list_registered_teams"}),
        name="list-registered-teams",
    ),
    path(
        "/tournaments/<str:id>/register-team",
        register_team,
        name="register_team",
    ),
    path(
        "/tournaments/<str:id>/create-and-register-team",
        create_and_register_team,
        name="create_and_register_team",
    ),
    # matches
    path(
        "/org/matches/<str:id>",
        OrganizerMatchViewSet.as_view({"patch": "partial_update"}),
        name="update-match",
    ),
    # TEST_MODE
]
