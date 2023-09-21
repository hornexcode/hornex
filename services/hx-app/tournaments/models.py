import uuid
from django.db import models
from django.core.exceptions import ValidationError


class Tournament(models.Model):
    class GameType(models.TextChoices):
        LEAGUE_OF_LEGENDS = "league-of-legends"

    class TournamentStatusType(models.TextChoices):
        NOT_STARTED = "not_started"
        STARTED = "started"
        FINISHED = "finished"
        CANCELLED = "cancelled"

    def validate_team_size(value):
        if value < 1:
            raise ValidationError("Team size must be greater than zero.")

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
    team_size = models.IntegerField(default=1, validators=[validate_team_size])

    teams = models.ManyToManyField(
        "teams.Team", through="TournamentTeam", related_name="tournaments"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class TournamentTeam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.tournament.name} - {self.team.name} ({self.id})"


class TournamentRegistrationManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(cancelled_at__isnull=True)


class TournamentRegistration(models.Model):
    objects = TournamentRegistrationManager()

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

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


# TournamentEntry


# League of Legends
class LeagueOfLegendsTournamentProvider(models.Model):
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


class LeagueOfLegendsTournament(Tournament):
    class Tier(models.TextChoices):
        IRON = "IRON"
        BRONZE = "BRONZE"
        SILVER = "SILVER"
        GOLD = "GOLD"
        PLATINUM = "PLATINUM"
        DIAMOND = "DIAMOND"
        MASTER = "MASTER"
        GRANDMASTER = "GRANDMASTER"
        CHALLENGER = "CHALLENGER"

    provider = models.ForeignKey(
        LeagueOfLegendsTournamentProvider,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
    )
    tier = models.CharField(
        max_length=20,
        choices=Tier.choices,
        default=Tier.IRON,
    )

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class LeagueOfLegendsTournamentCode(models.Model):
    code = models.CharField(max_length=30, primary_key=True, editable=False)
    tournament = models.ForeignKey(LeagueOfLegendsTournament, on_delete=models.CASCADE)
    users = models.ManyToManyField("users.User", related_name="tournament_codes")
    created_at = models.DateTimeField(auto_now_add=True)
