from django.urls import path
from tournaments.views import TournamentReadOnlyViewSet, TournamentViewSet

urlpatterns = [
    path(
        "", TournamentReadOnlyViewSet.as_view({"get": "list"}), name="tournament-list"
    ),
    path(
        "/<str:platform>/<str:game>/<str:id>",
        TournamentViewSet.as_view({"get": "retrieve"}),
        name="tournament-details",
    ),
    # path(
    #     "/registrations",
    #     TournamentRegistrationViewSet.as_view({"get": "list"}),
    #     name="tournament-registration",
    # ),
    # path(
    #     "/<str:id>/unregister",
    #     TournamentViewSet.as_view({"delete": "unregister"}),
    #     name="tournament-unregister",
    # ),
]
