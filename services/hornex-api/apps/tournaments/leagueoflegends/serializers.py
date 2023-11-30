from rest_framework import serializers

from apps.tournaments.leagueoflegends.models import LeagueOfLegendsTournament


class LeagueOfLegendsTournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeagueOfLegendsTournament
        fields = "__all__"

    # def to_representation(self, instance):
    #     return super().to_representation(instance)
