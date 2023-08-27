from rest_framework import serializers
from teams.models import Team, TeamInvite
from teams.errors import user_not_found, team_invite_already_exists
from users.models import User
from typing import Optional
from datetime import datetime


def get_user(email: str) -> Optional[User]:
    try:
        return User.objects.get(email=email)
    except User.DoesNotExist:
        return None


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = "__all__"
        read_only_fields = ["id", "owner", "created_at", "updated_at", "deactivated_at"]

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user

        u = get_user(validated_data["owner"])
        if u is None:
            raise user_not_found

        validated_data["owner"] = u

        return super().create(validated_data)


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
