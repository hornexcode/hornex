from rest_framework import serializers

from apps.platforms.models import Platform


class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = "__all__"
