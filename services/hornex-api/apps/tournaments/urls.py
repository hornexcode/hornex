from django.urls import path

from apps.tournaments.views import (
    RegistrationViewSet,
    TournamentReadOnlyViewSet,
    TournamentRegistrationViewSet,
    TournamentViewSet,
    check_in,
    pariticipant_checked_in,
    team_check_in_status,
    tournaments_controller,
)

# set namespace
app_name = "tournaments"

urlpatterns = [
    # organizer
    path(
        "/organizer/tournaments",
        tournaments_controller,
        name="dashboard-tournaments-controller",
    ),
    path(
        "/organizer/tournaments/<str:id>",
        TournamentViewSet.as_view({"patch": "partial_update"}),
        name="details",
    ),
    # web
    path(
        "/tournaments/<str:id>/registrations",
        TournamentRegistrationViewSet.as_view({"post": "register"}),
        name="register",
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
    # @deprecated
    path(
        "/<str:platform>/<str:game>/tournaments",
        TournamentReadOnlyViewSet.as_view({"get": "list"}),
        name="list",
    ),
    # @deprecated
    path(
        "/<str:platform>/<str:game>/tournaments/<str:id>/details",
        TournamentViewSet.as_view({"get": "retrieve"}),
        name="details",
    ),
    # TEST_MODE
]
