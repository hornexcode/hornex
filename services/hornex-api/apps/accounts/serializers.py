from rest_framework import serializers

from apps.accounts.models import GameID, Profile


class GameIDSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameID
        fields = "__all__"


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"
