from rest_framework import serializers, status

# REST Framework errors
user_not_found = serializers.ValidationError({"message": "User not found"})
team_invite_already_exists = serializers.ValidationError(
    {"message": "Invite already exists"},
    code=status.HTTP_409_CONFLICT,
)
