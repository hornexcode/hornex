from django.db import models


class BaseModel(models.Model):
    class GameType(models.TextChoices):
        LEAGUE_OF_LEGENDS = "league-of-legends"

    class PlatformType(models.TextChoices):
        PC = "pc"

    game = models.CharField(
        choices=GameType.choices, max_length=50, default=GameType.LEAGUE_OF_LEGENDS
    )
    platform = models.CharField(
        choices=PlatformType.choices, max_length=50, default=PlatformType.PC
    )

    class Meta:
        abstract = True
