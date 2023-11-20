import uuid
from django.db import models
from apps.users.models import User
from apps.tournaments.leagueoflegends.models import Tier


class LeagueOfLegendsAccount(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="leagueoflegendsaccount"
    )
    username = models.CharField(max_length=255)
    password = models.CharField(max_length=255)
    summoner_name = models.CharField(max_length=255)
    region = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    tier = models.ForeignKey(Tier, on_delete=models.CASCADE, null=True)
