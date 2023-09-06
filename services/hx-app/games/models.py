from django.db import models

import uuid


class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30)
    slug = models.CharField(max_length=30)
    platforms = models.ManyToManyField("platforms.Platform")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deactivated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def save(self, *args, **kwargs):
        self.slug = self.name.lower().replace(" ", "-")
        super(Game, self).save(*args, **kwargs)


class GameAccount(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    game = models.ForeignKey("games.Game", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class GameAccountRiot(GameAccount):
    """
    Riot Games API

    https://developer.riotgames.com/apis#summoner-v4
    """

    class RegionChoicesType(models.TextChoices):
        BR1 = "BR1"
        EUN1 = "EUN1"
        EUW1 = "EUW1"
        JP1 = "JP1"
        KR = "KR"
        LA1 = "LA1"
        LA2 = "LA2"
        NA1 = "NA1"
        OC1 = "OC1"
        TR1 = "TR1"
        RU = "RU"
        PH2 = "PH2"
        SG2 = "SG2"
        TH2 = "TH2"
        TW2 = "TW2"
        VN2 = "VN2"

    encrypted_account_id = models.CharField(max_length=30)
    encrypted_puuid = models.CharField(max_length=78)
    username = models.CharField(max_length=30)
    region = models.CharField(max_length=4, choices=RegionChoicesType.choices)
    encrypted_summoner_id = models.CharField(max_length=63)
    summoner_name = models.CharField(max_length=30)  # Summoner name.
    summoner_level = (
        models.IntegerField()
    )  # Summoner level associated with the summoner.
    revision_date = (
        models.BigIntegerField()
    )  # Date summoner was last modified specified as epoch milliseconds. The following events will update this timestamp: summoner name change, summoner level change, or profile icon change.

    def __str__(self) -> str:
        return f"{self.summoner_name} ({self.id})"
