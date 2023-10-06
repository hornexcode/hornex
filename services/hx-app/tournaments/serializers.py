from rest_framework import serializers
from tournaments.models import Tournament, LeagueOfLegendsTournament


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
    class Meta:
        model = Tournament
        fields = "__all__"


class LeagueOfLegendsTournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeagueOfLegendsTournament
        fields = "__all__"

    def to_representation(self, instance):
        print(instance)
        return super().to_representation(instance)


class RegistrationSerializer(serializers.Serializer):
    team = serializers.UUIDField()
    tournament = serializers.UUIDField()
