import uuid
from django.db import models
from apps.users.models import User
from apps.tournaments.leagueoflegends.models import Classification


class LeagueOfLegendsAccount(models.Model):
    class TagLineType(models.TextChoices):
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

    summoner_id = models.CharField(max_length=255)
    account_id = models.CharField(max_length=255)
    puuid = models.CharField(max_length=255)
    summoner_name = models.CharField(max_length=255)
    profile_icon_id = models.IntegerField()
    revision_date = models.IntegerField()
    summoner_level = models.IntegerField()

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="leagueoflegendsaccount"
    )

    sub = models.CharField(max_length=255)
    jti = models.CharField(max_length=255)
    tag_line = models.CharField(
        choices=TagLineType.choices, max_length=50, default=TagLineType.BR1
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    classification = models.ForeignKey(
        Classification, on_delete=models.CASCADE, null=True
    )

    def get_classification(self) -> str:
        return "{}".format(self.classification.id)
