from rest_framework import serializers
from apps.tournaments.models import Tournament, Registration


class TournamentListSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    start_time = serializers.DateTimeField(read_only=True)
    end_time = serializers.DateTimeField(read_only=True)
    game = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.CharField(read_only=True)
    potential_prize_pool = serializers.IntegerField(read_only=True)
    entry_fee = serializers.IntegerField(read_only=True)
    max_teams = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)


class TournamentSerializer(serializers.ModelSerializer):
    classification = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = "__all__"

    def get_classification(self, obj):
        return obj.get_classification()


class RegistrationCreateSerializer(serializers.Serializer):
    team = serializers.UUIDField()
    tournament = serializers.UUIDField()


class RegistrationReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = "__all__"
