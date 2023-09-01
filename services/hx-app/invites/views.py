from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from invites.serializers import InviteSerializer
from teams.models import TeamInvite
from teams.serializers import TeamInviteSerializer
from datetime import datetime


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_invites(request):
    """Returns all team invites for a user."""
    u = request.user

    filtering = {"status": request.query_params.get("status", None)}
    if filtering["status"] is not None and filtering["status"] == "accepted":
        il = TeamInvite.objects.filter(
            user__id=u.id, accepted_at__isnull=False, declined_at__isnull=True
        )
    elif filtering["status"] is not None and filtering["status"] == "declined":
        il = TeamInvite.objects.filter(
            user__id=u.id, declined_at__isnull=True, accepted_at__isnull=False
        )
    elif filtering["status"] is not None and filtering["status"] == "pending":
        il = TeamInvite.objects.filter(
            user__id=u.id, accepted_at__isnull=True, declined_at__isnull=True
        )
    else:
        il = TeamInvite.objects.filter(user__id=u.id)

    ils = InviteSerializer(il, many=True)
    return Response(ils.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_invite(request):
    """Accepts a team invite."""
    invite_id = request.data.get("invite_id", None)

    try:
        invite = TeamInvite.objects.get(id=invite_id)
    except TeamInvite.DoesNotExist:
        return Response(
            {"error": "Invite not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    ies = TeamInviteSerializer(invite, context={"request": request})
    ies.accept()

    return Response(status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def decline_invite(request):
    invite_id = request.data.get("invite_id", None)

    try:
        invite = TeamInvite.objects.get(id=invite_id)
    except TeamInvite.DoesNotExist:
        return Response(
            {"error": "Invite not found."},
            status=status.HTTP_404_NOT_FOUND,
        )

    ies = TeamInviteSerializer(invite, context={"request": request})
    ies.decline()

    return Response(status=status.HTTP_200_OK)
