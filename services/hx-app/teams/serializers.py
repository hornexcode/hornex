from rest_framework import serializers
from teams.models import Team, TeamInvite
from teams.errors import user_not_found, team_invite_already_exists
from users.models import User
from typing import Optional
from datetime import datetime
from rest_framework_simplejwt.authentication import JWTAuthentication


def get_user(id: str) -> Optional[User]:
    try:
        return User.objects.get(id)
    except User.DoesNotExist:
        return None


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "deactivated_at",
        ]

    def create(self, validated_data):
        jwt_authentication = JWTAuthentication()
        request = self.context["request"]

        user, _ = jwt_authentication.authenticate(request)

        validated_data["created_by"] = user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        if instance.created_by != self.context["request"].user:
            raise serializers.ValidationError(
                {"message": "You do not have permission to update this team."}
            )
        return super().update(instance, validated_data)

    # TODO deactivate method


class TeamInviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamInvite
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "accepted_at",
            "rejected_at",
            "expired_at",
        ]

    def create(self, validated_data):
        u = validated_data["user"]
        it = TeamInvite.objects.filter(team=validated_data["team"], user=u)
        if it.exists():
            raise team_invite_already_exists

        return super().create(validated_data)

    def accept(self):
        if self.context["request"].user != self.instance.user:
            raise serializers.ValidationError(
                {"message": "You do not have permission to accept this invite."}
            )

        if self.instance.rejected_at is not None:
            raise serializers.ValidationError(
                {"message": "Invite has already been rejected."}
            )

        if self.instance.accepted_at is not None:
            raise serializers.ValidationError(
                {"message": "Invite has already been accepted."}
            )

        self.instance.accepted_at = datetime.utcnow()
        self.instance.save()
