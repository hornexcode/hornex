from rest_framework import serializers, status
from rest_framework.response import Response

# REST Framework errors
user_not_found = serializers.ValidationError({"message": "User not found"})
team_invite_already_exists = serializers.ValidationError(
    {"message": "Invite already exists"},
    code=status.HTTP_409_CONFLICT,
)
slugs_required = Response(
    {"error": "Both game and platform are required."},
    status=status.HTTP_400_BAD_REQUEST,
)
unauthorized_error = serializers.ValidationError(
    {"message": "You do not have permission."},
)
already_team_member = serializers.ValidationError({"message": "User is already a team member."})
invite_not_found = Response(
    {"message": "Not found."},
    status=status.HTTP_404_NOT_FOUND,
)
invite_does_not_belongs_to_you = Response(
    {"message": "This invite does not belongs to you."},
    status=status.HTTP_400_BAD_REQUEST,
)
invite_accepted = Response(
    {"message": "This invite has been accepted."},
    status=status.HTTP_400_BAD_REQUEST,
)
invite_declined = Response(
    {"message": "This invite has been declined."},
    status=status.HTTP_400_BAD_REQUEST,
)
invite_expired = Response(
    {"message": "This invite has expired."},
    status=status.HTTP_400_BAD_REQUEST,
)
