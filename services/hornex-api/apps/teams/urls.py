from django.urls import path
from apps.teams.views import TeamViewSet, InviteViewSet, MembershipViewSet


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
        "/<str:id>/invites",
        InviteViewSet.as_view({"get": "list", "post": "create"}),
        name="team-invite-list",
    ),
    path(
        "/<str:team_id>/invites/<str:id>",
        InviteViewSet.as_view({"delete": "destroy"}),
        name="team-invite-details",
    ),
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
