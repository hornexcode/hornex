from rest_framework import serializers
import time


class InviteSerializer(serializers.Serializer):
    """Returns all team invites for a user."""

    team = serializers.RelatedField(read_only=True)
    accepted = serializers.SerializerMethodField()
    rejected = serializers.SerializerMethodField()

    def to_representation(self, instance):
        return {
            "id": instance.id,
            "team": {
                "id": instance.team.id,
                "name": instance.team.name,
                "description": instance.team.description,
            },
            "accepted": instance.accepted_at is not None,
            "rejected": instance.rejected_at is not None,
        }

    def accept(self, instance):
        instance.accepted_at = int(time.time())
        instance.save()
