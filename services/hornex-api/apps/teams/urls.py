from django.urls import path

from apps.teams.views import (
    InviteViewSet,
    TeamViewSet,
    accept_invite,
    decline_invite,
    get_invites,
    get_invites_count,
)

urlpatterns = [
    path(
        "/tournaments/<str:id>/mount",
        TeamViewSet.as_view({"post": "mount_team"}),
        name="team-mount",
    ),
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
        InviteViewSet.as_view({"get": "list", "post": "create"}),
        name="team-invite-list",
    ),
    path(
        "/<str:team_id>/invites/<str:id>",
        InviteViewSet.as_view({"delete": "destroy"}),
        name="team-invite-details",
    ),
    path("/invites/users", get_invites, name="invite-list"),
    path("/invites/count", get_invites_count, name="invites_count"),
    path("/invites/accept", accept_invite, name="invite-accept"),
    path("/invites/decline", decline_invite, name="invite-decline"),
]
