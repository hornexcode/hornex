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
unauthorized_serialize = serializers.ValidationError(
    {"message": "You do not have permission."},
)
unauthorized = Response(
    {"message": "You do not have permission."},
    status=status.HTTP_401_UNAUTHORIZED,
)
member_not_found = serializers.ValidationError({"message": "Member not found"})
