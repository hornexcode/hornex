from typing import Iterable, Optional
import uuid
from django.db import models


class Game(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=100, null=True, blank=True)
    slug = models.SlugField(max_length=30, unique=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def save(self, *args, **kwargs):
        self.slug = self.name.lower().replace(" ", "-")
        super(Game, self).save(*args, **kwargs)


class Tournament(models.Model):
    class TournamentStatusType(models.TextChoices):
        NOT_STARTED = "not_started"
        STARTED = "started"
        FINISHED = "finished"
        CANCELLED = "cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=100, null=True, blank=True)
    organizer = models.ForeignKey("users.User", on_delete=models.RESTRICT)
    game = models.ForeignKey(Game, on_delete=models.RESTRICT)
    is_public = models.BooleanField(default=False)
    status = models.CharField(
        max_length=50,
        choices=TournamentStatusType.choices,
        default=TournamentStatusType.NOT_STARTED,
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    potential_prize_pool = models.IntegerField(default=0, null=True, blank=True)
    entry_fee = models.IntegerField(default=0, null=True, blank=True)

    max_teams = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class TournamentRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.tournament.name} - {self.team.name}"
