import structlog
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count
from django_filters import rest_framework as filters
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status, viewsets
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.teams.errors import (
    invite_accepted,
    invite_declined,
    invite_does_not_belongs_to_you,
    invite_expired,
    invite_not_found,
)
from apps.teams.models import Invite, Team
from apps.teams.request import MountTeamParams
from apps.teams.serializers import (
    InviteListSerializer,
    InviteSerializer,
    TeamSerializer,
    UserInviteSerializer,
)
from apps.teams.usecases import MountTeamInput, MountTeamUseCase
from core.route import extract_game_and_platform
from jwt_token.authentication import JWTAuthentication

logger = structlog.get_logger(__name__)


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

    @swagger_auto_schema(
        operation_description="POST /api/v1/teams/mount",
        operation_summary="Mount a team",
    )
    def mount_team(self, request, *args, **kwargs):
        params = MountTeamParams(data={**request.data, "user_id": request.user.id})
        params.is_valid(raise_exception=True)

        uc = MountTeamUseCase()

        output = uc.execute(MountTeamInput(**params.validated_data))

        return Response(TeamSerializer(output.team).data, status=status.HTTP_201_CREATED)


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

    def destroy(self, **kwargs):
        team_id = kwargs.get("team_id")
        id = kwargs.get("id")
        try:
            invite = Invite.objects.get(team__id=team_id, id=id)
            invite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except ObjectDoesNotExist as err:
            return Response({"message": str(err)}, status=status.HTTP_404_NOT_FOUND)


@swagger_auto_schema(
    operation_description="GET /api/v1/invites",
    operation_summary="List all team invites for a user",
    methods=["get"],
    responses={
        200: openapi.Response("response description", UserInviteSerializer),
    },
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_invites(request):
    u = request.user

    filtering = {"status": request.query_params.get("status", None)}
    if filtering["status"] is not None and filtering["status"] == "accepted":
        il = Invite.objects.filter(
            user__id=u.id, accepted_at__isnull=False, declined_at__isnull=True
        )
    elif filtering["status"] is not None and filtering["status"] == "declined":
        il = Invite.objects.filter(
            user__id=u.id, declined_at__isnull=True, accepted_at__isnull=False
        )
    elif filtering["status"] is not None and filtering["status"] == "pending":
        il = Invite.objects.filter(
            user__id=u.id, accepted_at__isnull=True, declined_at__isnull=True
        )
    else:
        il = Invite.objects.filter(user__id=u.id)

    ils = UserInviteSerializer(il, many=True)
    return Response(ils.data, status=status.HTTP_200_OK)


@swagger_auto_schema(
    operation_description="GET /api/v1/invites/count",
    operation_summary="Count all team invites for a user",
    methods=["get"],
    responses={
        200: openapi.Response("response description", int),
    },
)
@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def get_invites_count(request):
    u = request.user

    filtering = {"status": request.query_params.get("status", None)}
    inviteStatus = {}

    if filtering["status"] is not None and filtering["status"] == "accepted":
        inviteStatus = {
            "accepted_at__isnull": False,
            "declined_at__isnull": True,
        }
    elif filtering["status"] is not None and filtering["status"] == "declined":
        inviteStatus = {
            "declined_at__isnull": True,
            "accepted_at__isnull": False,
        }
    elif filtering["status"] is not None and filtering["status"] == "pending":
        inviteStatus = {
            "accepted_at__isnull": True,
            "declined_at__isnull": True,
        }

    return Response(
        Invite.objects.filter(user__id=u.id, **inviteStatus).count(),
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def accept_invite(request):
    """Accepts a team invite."""
    invite_id = request.data.get("invite_id", None)
    user = request.user

    try:
        invite = Invite.objects.get(id=invite_id)
    except Invite.DoesNotExist:
        return invite_not_found

    if user != invite.user:
        return invite_does_not_belongs_to_you

    if invite.expired_at:
        return invite_expired

    if invite.accepted_at:
        return invite_accepted

    if invite.declined_at:
        return invite_declined

    invite.accept()

    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def decline_invite(request):
    invite_id = request.data.get("invite_id", None)
    user = request.user

    try:
        invite = Invite.objects.get(id=invite_id)
    except Invite.DoesNotExist:
        return invite_not_found

    if user != invite.user:
        return invite_does_not_belongs_to_you

    if invite.expired_at:
        return invite_expired

    if invite.accepted_at:
        return invite_accepted

    if invite.declined_at:
        return invite_declined

    invite.decline()

    return Response(status=status.HTTP_200_OK)
