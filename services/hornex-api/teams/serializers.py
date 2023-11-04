from rest_framework import serializers
from teams.models import Team, TeamInvite, TeamMember
from teams.errors import (
    unauthorized_error,
    team_invite_already_exists,
    already_team_member,
)
from datetime import datetime
from users.serializers import UserSerializer


def check_is_owner(user, team):
    return user.id == team.created_by.id


class TeamSerializer(serializers.ModelSerializer):
    num_members = serializers.IntegerField(read_only=True)

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "description",
            "game",
            "platform",
            "num_members",
            "created_by",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "created_by",
            "created_at",
            "updated_at",
            "deactivated_at",
        ]

    def create(self, validated_data):
        request = self.context["request"]
        validated_data = {**validated_data, **{"created_by": request.user}}

        return super().create(validated_data)

    def update(self, instance, validated_data):
        is_owner = check_is_owner(self.context["request"].user, instance)
        if not is_owner:
            raise unauthorized_error

        return super().update(instance, validated_data)


class TeamMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TeamMember
        fields = "__all__"


class TeamInviteListSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = TeamInvite
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "accepted_at",
            "declined_at",
            "expired_at",
        ]


class TeamInviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamInvite
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "accepted_at",
            "declined_at",
            "expired_at",
        ]

    def create(self, validated_data):
        admin = self.context["request"].user
        user = validated_data["user"]
        team = validated_data["team"]

        member = TeamMember.objects.filter(team=team, user__id=admin.id).first()

        if not member or not member.is_admin:
            raise unauthorized_error

        it = TeamMember.objects.filter(team=team, user=user)
        if it.exists():
            raise already_team_member

        it = TeamInvite.objects.filter(team=team, user=user)
        if it.exists():
            raise team_invite_already_exists

        return super().create(validated_data)

    def accept(self):
        if self.context["request"].user.id != self.instance.user.id:
            raise serializers.ValidationError(
                {"message": "You do not have permission to accept this invite."}
            )

        if self.instance.declined_at is not None:
            raise serializers.ValidationError(
                {"message": "Invite has already been declined."}
            )

        if self.instance.accepted_at is not None:
            raise serializers.ValidationError(
                {"message": "Invite has already been accepted."}
            )

        self.instance.accepted_at = datetime.utcnow()
        self.instance.save()
        TeamMember.objects.create(team=self.instance.team, user=self.instance.user)

    def decline(self):
        if self.context["request"].user.id != self.instance.user.id:
            raise serializers.ValidationError(
                {"message": "You do not have permission to decline this invite."}
            )

        if self.instance.declined_at is not None:
            raise serializers.ValidationError(
                {"message": "Invite has already been declined."}
            )

        if self.instance.accepted_at is not None:
            raise serializers.ValidationError(
                {"message": "Invite has already been accepted."}
            )

        self.instance.declined_at = datetime.utcnow()
        self.instance.save()
