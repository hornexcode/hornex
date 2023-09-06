import uuid
from django.db import models


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
    game = models.ForeignKey("games.Game", on_delete=models.RESTRICT)
    platform = models.ForeignKey("platforms.Platform", on_delete=models.RESTRICT)
    is_public = models.BooleanField(default=False)
    status = models.CharField(
        max_length=50,
        choices=TournamentStatusType.choices,
        default=TournamentStatusType.NOT_STARTED,
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    is_entry_free = models.BooleanField(default=False, help_text="No entry fee")

    # If not fixed, we can set custom prize amount
    is_prize_pool_fixed = models.BooleanField(
        default=True, help_text="Fixed prize pool"
    )

    prize_pool = models.IntegerField(default=0, null=True, blank=True)
    entry_fee = models.IntegerField(default=0, null=True, blank=True)

    max_teams = models.IntegerField(default=0)
    teams = models.ManyToManyField(
        "teams.Team", through="TournamentTeam", related_name="tournaments"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.name


class TournamentTeam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.tournament.name} - {self.team.name}"


class TournamentRegistration(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.tournament.name} - {self.team.name}"
