from django.db import models

from apps.games.models import GameID


class LeagueOfLegendsSummoner(models.Model):
    id = models.CharField(max_length=500, primary_key=True, editable=True)
    game_id = models.ForeignKey(GameID, on_delete=models.CASCADE)
    puuid = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    ello = models.ForeignKey(
        "tournaments.LeagueOfLegendsEllo", on_delete=models.CASCADE, blank=True, null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
