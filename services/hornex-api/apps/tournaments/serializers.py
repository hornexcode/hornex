from rest_framework import serializers

from apps.teams.serializers import TeamSerializer
from apps.tournaments.models import (
    LeagueOfLegendsTournament,
    Participant,
    Prize,
    Registration,
    Tournament,
)


class TournamentListSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    name = serializers.CharField(read_only=True)
    start_time = serializers.DateTimeField(read_only=True)
    game = serializers.PrimaryKeyRelatedField(read_only=True)
    status = serializers.CharField(read_only=True)
    potential_prize_pool = serializers.IntegerField(read_only=True)
    entry_fee = serializers.IntegerField(read_only=True)
    max_teams = serializers.IntegerField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)


class TournamentSerializer(serializers.ModelSerializer):
    total_participants = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = "__all__"

    def get_total_participants(self, obj):
        return obj.participants.count()


class RegistrationCreateSerializer(serializers.Serializer):
    team = serializers.UUIDField()
    tournament = serializers.UUIDField()


class RegistrationSerializer(serializers.ModelSerializer):
    team = TeamSerializer(read_only=True)
    tournament = TournamentSerializer(read_only=True)

    class Meta:
        model = Registration
        fields = "__all__"


class LeagueOfLegendsTournamentSerializer(serializers.ModelSerializer):
    classifications = serializers.SerializerMethodField()
    total_participants = serializers.SerializerMethodField()

    class Meta:
        model = LeagueOfLegendsTournament
        fields = "__all__"

    def get_classifications(self, obj):
        return [
            f"{classification.tier} {classification.rank}"
            for classification in obj.classifications.all()
        ]

    def get_total_participants(self, obj):
        return obj.participants.count()


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = "__all__"


class PrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prize
        fields = "__all__"
