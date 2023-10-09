import uuid
from django.db import models
from django.utils import timezone
from abc import abstractmethod

from tournaments.validators import validate_team_size


class Tournament(models.Model):
    class Meta:
        ordering = ["-created_at"]

    class GameType(models.TextChoices):
        LEAGUE_OF_LEGENDS = "league-of-legends"

    class PlatformType(models.TextChoices):
        PC = "pc"
        PS4 = "ps4"
        XBOX = "xbox"
        MOBILE = "mobile"

    class TournamentStatusType(models.TextChoices):
        NOT_STARTED = "not_started"
        STARTED = "started"
        FINISHED = "finished"
        CANCELLED = "cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=100, null=True, blank=True)
    organizer = models.ForeignKey("users.User", on_delete=models.RESTRICT)
    game = models.CharField(
        choices=GameType.choices, max_length=50, default=GameType.LEAGUE_OF_LEGENDS
    )
    platform = models.CharField(
        choices=PlatformType.choices, max_length=50, default=PlatformType.PC
    )
    is_public = models.BooleanField(default=False)
    status = models.CharField(
        max_length=50,
        choices=TournamentStatusType.choices,
        default=TournamentStatusType.NOT_STARTED,
    )

    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    is_entry_free = models.BooleanField(default=False, help_text="No entry fee")
    is_prize_pool_fixed = models.BooleanField(
        default=True, help_text="Fixed prize pool"
    )

    prize_pool = models.IntegerField(default=0, null=True, blank=True)
    entry_fee = models.IntegerField(default=0, null=True, blank=True)

    max_teams = models.IntegerField(default=0)
    team_size = models.IntegerField(default=5, validators=[validate_team_size])

    teams = models.ManyToManyField(
        "teams.Team", through="TournamentTeam", related_name="tournaments"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def register(self, team):
        if Registration.objects.count() >= self.max_teams:
            raise Exception("Max teams reached")
        Registration.objects.create(tournament=self, team=team)
        return

    def cancel_registration(self, team):
        registration = Registration.objects.get(tournament=self, team=team)
        registration.cancelled_at = timezone.now()
        registration.save()
        return

    @abstractmethod
    def get_classification(self):
        raise NotImplementedError


class TournamentTeam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.tournament.name} - {self.team.name} ({self.id})"


class RegistrationManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(cancelled_at__isnull=True)


class Registration(models.Model):
    objects = RegistrationManager()

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.tournament.name} - {self.team.name} ({self.id})"


class Bracket(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team_a = models.ForeignKey(
        "teams.Team",
        on_delete=models.CASCADE,
        related_name="team_a",
        null=True,
        blank=True,
    )
    team_b = models.ForeignKey(
        "teams.Team",
        on_delete=models.CASCADE,
        related_name="team_b",
        null=True,
        blank=True,
    )
    winner = models.ForeignKey(
        "teams.Team",
        on_delete=models.CASCADE,
        related_name="winner",
        null=True,
        blank=True,
    )
    loser = models.ForeignKey(
        "teams.Team",
        on_delete=models.CASCADE,
        related_name="loser",
        null=True,
        blank=True,
    )
    round = models.IntegerField(null=False, editable=False)

    def __str__(self) -> str:
        return f"Bracket ({self.id}) | round: {self.round} | {self.tournament.name}"
