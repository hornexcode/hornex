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
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"League of Legends Provider ({self.id})"


class Classification(models.Model):
    class Tier(models.TextChoices):
        IRON = "IRON"
        BRONZE = "BRONZE"
        SILVER = "SILVER"
        GOLD = "GOLD"
        PLATINUM = "PLATINUM"
        EMERALD = "EMERALD"
        DIAMOND = "DIAMOND"
        MASTER = "MASTER"
        GRANDMASTER = "GRANDMASTER"
        CHALLENGER = "CHALLENGER"

    class Rank(models.TextChoices):
        # ruff: noqa: E741
        I = "I"
        II = "II"
        III = "III"
        IV = "IV"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tier = models.CharField(max_length=50, choices=Tier.choices, default=Tier.SILVER)
    rank = models.CharField(max_length=50, choices=Rank.choices, default=Rank.I)

    def __str__(self) -> str:
        return f"{self.tier} {self.rank} ({self.id})"


class LeagueOfLegendsTournament(BaseTournament):
    class PickType(models.TextChoices):
        BLIND_PICK = "BLIND_PICK"
        DRAFT_MODE = "DRAFT_MODE"
        ALL_RANDOM = "ALL_RANDOM"
        TOURNAMENT_DRAFT = "TOURNAMENT_DRAFT"

    class MapType(models.TextChoices):
        SUMMONERS_RIFT = "SUMMONERS_RIFT"
        TWISTED_TREELINE = "TWISTED_TREELINE"
        HOWLING_ABYSS = "HOWLING_ABYSS"

    class SpectatorType(models.TextChoices):
        NONE = "NONE"
        LOBBYONLY = "LOBBYONLY"
        ALL = "ALL"

    provider = models.ForeignKey(
        LeagueOfLegendsTournamentProvider,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
    )
    riot_id = models.IntegerField(null=True, blank=True)
    classifications = models.ManyToManyField(Classification)
    pick = models.CharField(
        max_length=50, choices=PickType.choices, default=PickType.BLIND_PICK
    )
    map = models.CharField(
        max_length=50, choices=MapType.choices, default=MapType.SUMMONERS_RIFT
    )
    spectator = models.CharField(
        max_length=50, choices=SpectatorType.choices, default=SpectatorType.LOBBYONLY
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def get_classifications(self) -> list[str]:
        return ["{}".format(c.id) for c in self.classifications.all()]


class Code(models.Model):
    code = models.CharField(max_length=30, primary_key=True, editable=False)
    tournament = models.ForeignKey(LeagueOfLegendsTournament, on_delete=models.CASCADE)
    match = models.ForeignKey("tournaments.Match", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
