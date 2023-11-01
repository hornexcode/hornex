from rest_framework import viewsets, status
from django_filters import rest_framework as filters
from django.db.models import Count
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
import uuid

from teams.models import Team, TeamInvite, TeamMember
from teams.serializers import (
    TeamSerializer,
    TeamInviteSerializer,
    TeamMemberSerializer,
    TeamInviteListSerializer,
)
from core.route import extract_game_and_platform
from rest_framework_simplejwt.authentication import JWTAuthentication


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    lookup_field = "id"
    filter_backends = (filters.DjangoFilterBackend,)
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        game, platform = extract_game_and_platform(self.request.query_params)
        queryset = Team.objects.annotate(num_members=Count("members"))
        if game is not None:
            queryset = queryset.filter(game=game)
        if platform is not None:
            queryset = queryset.filter(platform=platform)
        return queryset

    def list(self, request, *args, **kwargs):
        return Response(
            {"teams": TeamSerializer(self.get_queryset(), many=True).data},
            status=status.HTTP_200_OK,
        )

    @swagger_auto_schema(
        operation_description="POST /api/v1/teams",
        operation_summary="Create a team",
    )
    def create(self, request, *args, **kwargs):
        serializer = TeamSerializer(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                {"team": serializer.data},
                status=status.HTTP_201_CREATED,
            )

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
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        queryset = TeamInvite.objects.all()
        return queryset

    @swagger_auto_schema(
        operation_description="GET /api/v1/teams/<id>/invites",
        operation_summary="List all invites for a team",
    )
    def list(self, request, *args, **kwargs):
        return Response(
            TeamInviteListSerializer(self.get_queryset(), many=True).data,
            status=status.HTTP_200_OK,
        )

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


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    lookup_field = "id"

    def get_queryset(self):
        id = self.kwargs.get("id")
        return TeamMember.objects.filter(team__id=id)

    @swagger_auto_schema(
        operation_description="GET /api/v1/teams/<id>/members",
        operation_summary="List all members for a team",
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="GET /api/v1/teams/<team_id>/members/<member_id>",
        operation_summary="Retrieve a member for a team",
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
