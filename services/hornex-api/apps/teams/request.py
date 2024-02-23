from rest_framework import serializers


class MountTeamParams(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    user_id = serializers.UUIDField()
    member_1_email = serializers.EmailField()
    member_2_email = serializers.EmailField()
    member_3_email = serializers.EmailField()
    member_4_email = serializers.EmailField()
