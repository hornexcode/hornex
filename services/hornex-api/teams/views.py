from rest_framework import viewsets, status
from django_filters import rest_framework as filters
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated

from teams.models import Team, TeamInvite
from games.models import Game
from platforms.models import Platform
from teams.serializers import TeamSerializer, TeamInviteSerializer
from core.route import extract_game_and_platform
from django.shortcuts import get_object_or_404


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    lookup_field = "id"
    filter_backends = (filters.DjangoFilterBackend,)
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        operation_description="GET /api/v1/<platform>/<game>/teams",
        operation_summary="List all teams for a game and platform",
    )
    def list(self, request, *args, **kwargs):
        game, platform = extract_game_and_platform(kwargs)
        self.queryset = Team.objects.filter(
            platform=platform, game=game, members=request.user
        )

        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="GET /api/v1/<platform>/<game>/teams/<id>",
        operation_summary="Retrieve a team",
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="POST /api/v1/<platform>/<game>/teams",
        operation_summary="Create a team",
    )
    def create(self, request, *args, **kwargs):
        game, platform = extract_game_and_platform(kwargs)

        payload = request.data
        payload["game"] = game
        payload["platform"] = platform

        serializer = TeamSerializer(data=payload, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        operation_description="PUT /api/v1/<platform>/<game>/teams/<id>",
        operation_summary="Update a team",
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="DELETE /api/v1/<platform>/<game>/teams/<id>",
        operation_summary="Destroy a team",
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class TeamInviteViewSet(viewsets.ModelViewSet):
    queryset = TeamInvite.objects.all()
    serializer_class = TeamInviteSerializer
    lookup_field = "id"

    @swagger_auto_schema(
        operation_description="GET /api/v1/<platform>/<game>/teams/<id>/invites",
        operation_summary="List all invites for a team",
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="POST /api/v1/<platform>/<game>/teams/<id>/invites",
        operation_summary="Create an invite for a team",
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="GET /api/v1/<platform>/<game>/teams/<id>/invites/<id>",
        operation_summary="Retrieve an invite for a team",
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
