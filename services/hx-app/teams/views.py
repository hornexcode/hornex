from rest_framework import viewsets

from teams.models import Team, TeamInvite
from teams.serializers import TeamSerializer, TeamInviteSerializer
from .errors import slugs_required
from .filters import TeamFilter
from django_filters import rest_framework as filters
from drf_yasg.utils import swagger_auto_schema


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    lookup_field = "id"
    filter_backends = (filters.DjangoFilterBackend, TeamFilter)

    @swagger_auto_schema(
        operation_description="GET /api/v1/teams",
        operation_summary="List all teams for a game and platform",
    )
    def list(self, request, *args, **kwargs):
        gslug = request.query_params.get("game")
        pslug = request.query_params.get("platform")

        if not (gslug and pslug):
            return slugs_required

        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="GET /api/v1/teams/<id>",
        operation_summary="Retrieve a team",
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="POST /api/v1/teams",
        operation_summary="Create a team",
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="PUT /api/v1/teams/<id>",
        operation_summary="Update a team",
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="DELETE /api/v1/teams/<id>",
        operation_summary="Destroy a team",
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class TeamInviteViewSet(viewsets.ModelViewSet):
    queryset = TeamInvite.objects.all()
    serializer_class = TeamInviteSerializer
    lookup_field = "id"

    @swagger_auto_schema(
        operation_description="GET /api/v1/teams/<id>/invites",
        operation_summary="List all invites for a team",
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="POST /api/v1/teams/<id>/invites",
        operation_summary="Create an invite for a team",
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="GET /api/v1/teams/<id>/invites/<id>",
        operation_summary="Retrieve an invite for a team",
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
