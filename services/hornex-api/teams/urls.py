from django.urls import path
from teams.views import TeamViewSet, TeamInviteViewSet, TeamMemberViewSet


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
        name="team-details",
    ),
    path(
        "/<str:id>/invites",
        TeamInviteViewSet.as_view({"get": "list", "post": "create"}),
        name="team-invite-list",
    ),
    path(
        "/<str:id>/members",
        TeamMemberViewSet.as_view({"get": "list"}),
        name="team-members",
    ),
    path(
        "/<str:team_id>/members/<str:id>",
        TeamMemberViewSet.as_view(
            {
                "delete": "destroy",
            }
        ),
        name="team-members-details",
    ),
]
