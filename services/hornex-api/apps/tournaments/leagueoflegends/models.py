import uuid
from django.db import models

from apps.tournaments.models import Tournament as BaseTournament


# League of Legends
class LeagueOfLegendsTournamentProvider(models.Model):
    class RegionType(models.TextChoices):
        BR = "BR"
        EUNE = "EUNE"
        EUW = "EUW"
        JP = "JP"
        KR = "KR"
        LAN = "LAN"
        LAS = "LAS"
        NA = "NA"
        OCE = "OCE"
        TR = "TR"
        RU = "RU"

    id = models.IntegerField(primary_key=True, editable=False)
    region = models.CharField(
        max_length=10, choices=RegionType.choices, default=RegionType.BR
    )
    url = models.URLField(
        editable=True,
        null=False,
    )
    provider_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"League of Legends Provider ({self.id})"


class Tier(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=20)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class LeagueOfLegendsTournament(BaseTournament):
    provider = models.ForeignKey(
        LeagueOfLegendsTournamentProvider,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
    )
    tiers = models.ManyToManyField(Tier)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def get_classification(self):
        return [tier.name for tier in self.tiers.all()]


class Code(models.Model):
    code = models.CharField(max_length=30, primary_key=True, editable=False)
    tournament = models.ForeignKey(LeagueOfLegendsTournament, on_delete=models.CASCADE)
    users = models.ManyToManyField("users.User", related_name="tournament_codes")
    created_at = models.DateTimeField(auto_now_add=True)
