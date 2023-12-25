import uuid

from django.db import models

from apps.users.models import User


class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.CharField(max_length=255)
    platforms = models.ManyToManyField("platforms.Platform")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deactivated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def save(self, *args, **kwargs):
        self.slug = self.name.lower().replace(" ", "-")
        super(Game, self).save(*args, **kwargs)


class GameID(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class GameOptions(models.TextChoices):
        LEAGUE_OF_LEGENDS = "league-of-legends"
        CS_GO = "cs-go"

    game = models.CharField(max_length=50, choices=GameOptions.choices)
    nickname = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.nickname
