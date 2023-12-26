from rest_framework import serializers

from apps.games.models import Game, GameID
from apps.platforms.serializers import PlatformSerializer


class GameSerializer(serializers.ModelSerializer):
    platforms = PlatformSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ["id", "name", "slug", "platforms"]


class GameIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameID
        fields = "__all__"
