from rest_framework import serializers

from apps.configs.models import Config


class ConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = "__all__"
