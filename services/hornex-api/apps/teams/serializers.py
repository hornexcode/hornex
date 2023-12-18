from rest_framework import serializers
from apps.teams.models import Team, Invite, Membership
from apps.teams.errors import (
    unauthorized_error,
    team_invite_already_exists,
    already_team_member,
)
from datetime import datetime
from apps.users.serializers import UserSerializer


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

    def validate(self, attrs):
        print(attrs)
        return super().validate(attrs)

    def create(self, validated_data):
        request = self.context["request"]
        validated_data = {**validated_data, **{"created_by": request.user}}

        return super().create(validated_data)

    def update(self, instance, validated_data):
        is_owner = check_is_owner(self.context["request"].user, instance)
        if not is_owner:
            raise unauthorized_error

        return super().update(instance, validated_data)


class MembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = "__all__"


class InviteListSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Invite
        fields = "__all__"
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "accepted_at",
            "declined_at",
            "expired_at",
        ]


class InviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invite
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

        member = Membership.objects.filter(team=team, user__id=admin.id).first()

        if not member or not member.is_admin:
            raise unauthorized_error

        it = Membership.objects.filter(team=team, user=user)
        if it.exists():
            raise already_team_member

        # Verify if team's pending invite already exists for this user
        it = Invite.objects.filter(
            team=team,
            user=user,
            accepted_at__isnull=True,
            declined_at__isnull=True,
            expired_at__isnull=True,
        )
        if it.exists():
            raise team_invite_already_exists

        return super().create(validated_data)


class UserInviteSerializer(serializers.Serializer):
    """Returns all team invites for a user."""

    team = serializers.RelatedField(read_only=True)
    accepted = serializers.BooleanField(read_only=True)
    declined = serializers.BooleanField(read_only=True)

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "team": {
                "id": instance.team.id,
                "name": instance.team.name,
                "description": instance.team.description,
                "platform": instance.team.platform,
                "game": instance.team.game,
            },
            "accepted": instance.accepted_at is not None,
            "declined": instance.declined_at is not None,
        }
