from rest_framework import serializers
from games.models import Game
from platforms.serializers import PlatformSerializer, Platform


class GameSerializer(serializers.ModelSerializer):
    platforms = PlatformSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ["id", "name", "slug", "platforms"]
