from django.contrib.auth import password_validation
from rest_framework import serializers

from apps.users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "password",
        ]
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def create(self, validated_data):
        # remove write_only parameters
        password = validated_data.pop("password")
        # Mount `name` and remove write_only parameters
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        return user


class LoggedInUserSerializerReadOnly(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    name = serializers.CharField(read_only=True)


def serialize_user(user: User) -> dict[str, any]:
    return {"id": user.id, "name": user.name, "email": user.email}
