from rest_framework import viewsets, status
from django_filters import rest_framework as filters
from django.db.models import Count
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated

from apps.teams.models import Team, Invite, Membership
from apps.teams.serializers import (
    TeamSerializer,
    InviteSerializer,
    MembershipSerializer,
    InviteListSerializer,
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

    @swagger_auto_schema(
        operation_description="POST /api/v1/teams",
        operation_summary="Create a team",
    )
    def create(self, request, *args, **kwargs):
        serializer = TeamSerializer(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

    @swagger_auto_schema(
        operation_description="PUT /api/v1/<platform>/<game>/teams/<id>",
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


class InviteViewSet(viewsets.ModelViewSet):
    queryset = Invite.objects.all()
    serializer_class = InviteSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    filter_backends = (filters.DjangoFilterBackend,)

    def get_queryset(self):
        self.serializer_class = InviteListSerializer
        team_id = self.kwargs.get("id")
        queryset = Invite.objects.filter(team__id=team_id)
        if "status" in self.request.GET:
            if self.request.GET["status"] == "pending":
                queryset = queryset.filter(
                    expired_at__isnull=True,
                    accepted_at__isnull=True,
                    declined_at__isnull=True,
                )
            if self.request.GET["status"] == "accepted":
                queryset = queryset.filter(
                    expired_at__isnull=True,
                    accepted_at__isnull=False,
                    declined_at__isnull=True,
                )
            if self.request.GET["status"] == "declined":
                queryset = queryset.filter(
                    expired_at__isnull=True,
                    accepted_at__isnull=True,
                    declined_at__isnull=False,
                )
        return queryset

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

    @swagger_auto_schema(
        operation_description="DELETE /api/v1/teams/<id>/invites/<id>",
        operation_summary="Destroy a invite",
    )
    def destroy(self, request, *args, **kwargs):
        team_id = kwargs.get("team_id")
        id = kwargs.get("id")
        try:
            invite = Invite.objects.get(team__id=team_id, id=id)

            admin = Membership.objects.filter(
                team__id=team_id, user=request.user, is_admin=True
            )
            if not admin.exists():
                return Response(
                    {"message": "You are not a team admin."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            invite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist as err:
            return Response({"message": str(err)}, status=status.HTTP_404_NOT_FOUND)


class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    lookup_field = "id"
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        id = self.kwargs.get("id")
        return Membership.objects.filter(team__id=id)

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

    @swagger_auto_schema(
        operation_description="DELETE /api/v1/teams/<id>/members",
        operation_summary="Destroy a member",
    )
    def destroy(self, request, *args, **kwargs):
        team_id = kwargs.get("team_id")
        id = kwargs.get("id")
        try:
            team_member = Membership.objects.get(team__id=team_id, id=id)
            team = Team.objects.get(id=team_id)

            admin = Membership.objects.filter(
                team__id=team_id, user=request.user, is_admin=True
            )
            if not admin.exists():
                return Response(
                    {"message": "You are not a team admin."},
                    status=status.HTTP_403_FORBIDDEN,
                )
            if team_member.user == team.created_by:
                return Response(
                    {"message": "The team owner can not be removed."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            team_member.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist as err:
            return Response({"message": str(err)}, status=status.HTTP_404_NOT_FOUND)
