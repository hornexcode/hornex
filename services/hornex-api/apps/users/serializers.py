from django.contrib.auth import password_validation
from rest_framework import serializers

from apps.users.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    first_name = serializers.CharField(write_only=True, required=True)
    last_name = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "email",
            "password",
            "first_name",
            "last_name",
            "password2",
        ]
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )

        return attrs

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def create(self, validated_data):
        # remove write_only parameters
        password = validated_data.pop("password")
        validated_data.pop("password2", None)

        # Mount `name` and remove write_only parameters
        first_name = validated_data.pop("first_name", None)
        last_name = validated_data.pop("last_name", None)
        validated_data["name"] = f"{first_name} {last_name}"

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
