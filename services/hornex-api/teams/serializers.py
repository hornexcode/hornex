from rest_framework import serializers
from teams.models import Team, TeamInvite, TeamMember
from teams.errors import (
    unauthorized_error,
    member_not_found,
    team_invite_already_exists,
)
from datetime import datetime
from users.models import User
from games.models import Game
from platforms.models import Platform
from django.shortcuts import get_object_or_404


def check_is_owner(user, team):
    return user.id == team.created_by.id


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "description",
            "game",
            "platform",
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

    def to_representation(self, instance):
        if self.context["view"].action == "retrieve":
            data = super().to_representation(instance)

            data["game"] = instance.game
            data["platform"] = instance.platform

            del data["description"]
            del data["created_at"]
            del data["updated_at"]
            del data["deactivated_at"]
            del data["created_by"]

            members = TeamMember.objects.filter(team=instance)
            member_data = [
                {"user": member.user, "is_admin": member.is_admin} for member in members
            ]
            data["members"] = member_data

            return data

        return super().to_representation(instance)

    # TODO deactivate method


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = "__all__"


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
        it = TeamInvite.objects.filter(team=team, user=user)
        if it.exists():
            raise team_invite_already_exists

        member = TeamMember.objects.filter(team=team, user__id=admin.id).first()
        if member is None:
            raise member_not_found

        if not member.is_admin:
            raise unauthorized_error

        return super().create(validated_data)

    def accept(self):
        if self.context["request"].user.id != str(self.instance.user.id):
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
        if self.context["request"].user.id != str(self.instance.user.id):
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

        self.instance.declined_at = datetime.utcnow()
        self.instance.save()
