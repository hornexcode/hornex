from rest_framework import serializers
from apps.games.models import Game
from apps.platforms.serializers import PlatformSerializer, Platform


class GameSerializer(serializers.ModelSerializer):
    platforms = PlatformSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ["id", "name", "slug", "platforms"]
