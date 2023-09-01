from django.urls import path
from teams.views import TeamViewSet, TeamInviteViewSet


urlpatterns = [
    path(
        "",
        TeamViewSet.as_view({"get": "list", "post": "create"}),
        name="team-list",
    ),
    path(
        "/<str:id>",
        TeamViewSet.as_view(
            {
                "get": "retrieve",
                "put": "update",
                "delete": "destroy",
            }
        ),
        name="team-list",
    ),
    path(
        "/<str:id>/invites",
        TeamInviteViewSet.as_view({"get": "list", "post": "create"}),
        name="team-invite-list",
    ),
]
