from rest_framework import serializers

from apps.tournaments.models import LeagueOfLegendsTournament


class LeagueOfLegendsTournamentSerializer(serializers.ModelSerializer):
    classification = serializers.StringRelatedField()

    class Meta:
        model = LeagueOfLegendsTournament
        fields = "__all__"

    def get_classification(self, obj):
        return [
            f"{classification.tier} {classification.rank}"
            for classification in obj.classifications.all()
        ]
