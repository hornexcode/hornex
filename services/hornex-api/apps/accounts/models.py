import uuid

from django.db import models


class TermsAndConditionsAgreement(models.Model):
    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
    )
    version = models.CharField(max_length=255)
    agreed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "version"]

    def __str__(self) -> str:
        return f"{self.user} - {self.version}"


class GameID(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField("users.User", on_delete=models.CASCADE, related_name="game_id")

    class GameOptions(models.TextChoices):
        LEAGUE_OF_LEGENDS = "league-of-legends"
        CS_GO = "cs-go"

    email = models.EmailField()
    game = models.CharField(max_length=50, choices=GameOptions.choices)
    nickname = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=False)

    metadata = models.JSONField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.email} | {self.nickname}"

    def set_league_of_legends_code(self, code: str) -> None:
        self.metadata = {"league_of_legends_code": code}
        self.save()

    def get_league_of_legends_code(self) -> str:
        return self.metadata.get("league_of_legends_code", "")


# @deprecated
class LeagueOfLegendsSummoner(models.Model):
    id = models.CharField(max_length=500, primary_key=True, editable=True)
    game_id = models.ForeignKey(GameID, on_delete=models.CASCADE)
    puuid = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    ello = models.ForeignKey(
        "tournaments.LeagueOfLegendsLeague", on_delete=models.CASCADE, blank=True, null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name
