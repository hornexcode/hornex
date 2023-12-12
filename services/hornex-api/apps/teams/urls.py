from django.urls import path
from apps.teams.views import TeamViewSet, InviteViewSet, MembershipViewSet
from apps.teams.views import (
    get_invites,
    accept_invite,
    decline_invite,
    get_invites_count,
)


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
    path(
        "/<str:id>/members",
        MembershipViewSet.as_view({"get": "list"}),
        name="team-members",
    ),
    path(
        "/<str:team_id>/members/<str:id>",
        MembershipViewSet.as_view(
            {
                "delete": "destroy",
            }
        ),
        name="team-members-details",
    ),
]
