from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.invites.serializers import InviteSerializer
from apps.teams.models import Invite
from .errors import (
    invite_not_found,
    invite_does_not_belongs_to_you,
    invite_expired,
    invite_accepted,
    invite_declined,
)
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework_simplejwt.authentication import JWTAuthentication


@swagger_auto_schema(
    operation_description="GET /api/v1/invites",
    operation_summary="List all team invites for a user",
    methods=["get"],
    responses={
        200: openapi.Response("response description", InviteSerializer),
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

    ils = InviteSerializer(il, many=True)
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
        inviteStatus = {"accepted_at__isnull": False, "declined_at__isnull": True}
    elif filtering["status"] is not None and filtering["status"] == "declined":
        inviteStatus = {"declined_at__isnull": True, "accepted_at__isnull": False}
    elif filtering["status"] is not None and filtering["status"] == "pending":
        inviteStatus = {"accepted_at__isnull": True, "declined_at__isnull": True}

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
