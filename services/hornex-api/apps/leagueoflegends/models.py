import uuid

from django.db import models

from apps.games.models import GameID
from apps.tournaments.models import Tournament as BaseTournament


class LeagueEntry(models.Model):
    class Meta:
        unique_together = ["tier", "rank"]
        ordering = ["tier", "rank"]

    class TierOptions(models.TextChoices):
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

    tier = models.CharField(max_length=25, choices=TierOptions.choices)

    class RankOptions(models.TextChoices):
        I = "I"
        II = "II"
        III = "III"
        IV = "IV"

    rank = models.CharField(max_length=25, choices=RankOptions.choices)

    def __str__(self) -> str:
        return f"{self.tier} {self.rank}"

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Summoner(models.Model):
    game_id = models.ForeignKey(GameID, on_delete=models.CASCADE)
    id = models.CharField(max_length=255, primary_key=True, editable=False)
    puuid = models.CharField(max_length=255)
    account_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    league_entry = models.ForeignKey(
        LeagueEntry, on_delete=models.CASCADE, blank=True, null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class Provider(models.Model):
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
    class Meta:
        unique_together = ["tier", "rank"]
        ordering = ["tier", "rank"]

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


class Tournament(BaseTournament):
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
        Provider,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
    )
    riot_id = models.IntegerField(null=True, blank=True)
    pick = models.CharField(
        max_length=50, choices=PickType.choices, default=PickType.BLIND_PICK
    )
    map = models.CharField(
        max_length=50, choices=MapType.choices, default=MapType.SUMMONERS_RIFT
    )
    spectator = models.CharField(
        max_length=50, choices=SpectatorType.choices, default=SpectatorType.LOBBYONLY
    )
    allowed_league_entries = models.ManyToManyField(LeagueEntry)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def get_classifications(self) -> list[str]:
        return [
            f"{entry.tier} {entry.rank}" for entry in self.allowed_league_entries.all()
        ]


class Code(models.Model):
    code = models.CharField(max_length=30, primary_key=True, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    match = models.ForeignKey("tournaments.Match", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Session(models.Model):
    game_id = models.ForeignKey(GameID, on_delete=models.CASCADE)
    scope = models.CharField(max_length=500)
    token_type = models.CharField(max_length=50)
    refresh_token = models.CharField(max_length=500)
    id_token = models.CharField(max_length=500)
    sub_id = models.CharField(max_length=500)
    access_token = models.CharField(max_length=500)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.game_id.nickname}'s Session"
