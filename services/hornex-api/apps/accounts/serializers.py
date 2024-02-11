from rest_framework import serializers

from apps.accounts.models import GameID


class GameIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameID
        fields = "__all__"
