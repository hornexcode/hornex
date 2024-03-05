import math
import uuid
from abc import abstractmethod
from datetime import UTC, datetime, timedelta

import structlog
from django.db import models

from apps.common.models import BaseModel
from apps.teams.models import Team
from apps.tournaments.validators import validate_team_size

logger = structlog.get_logger(__name__)

MINIMUM_PARTICIPANTS = 0


class Tournament(BaseModel):
    class StatusOptions(models.TextChoices):
        ANNOUNCED = "announced"
        REGISTERING = "registering"
        RUNNING = "running"
        ENDED = "ended"
        CANCELLED = "cancelled"

    class CurrencyEnum(models.TextChoices):
        USD = "USD"
        BRL = "BRL"
        EUR = "EUR"

    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    organizer = models.ForeignKey("users.User", on_delete=models.RESTRICT)
    published = models.BooleanField(default=False)
    status = models.CharField(
        max_length=50,
        choices=StatusOptions.choices,
        default=StatusOptions.ANNOUNCED,
    )

    registration_start_date = models.DateTimeField()
    check_in_duration = models.IntegerField(null=True, blank=True)

    start_date = models.DateField()
    start_time = models.TimeField()

    finished_at = models.DateTimeField(null=True, blank=True)
    feature_image = models.CharField(max_length=255, blank=True)

    is_entry_free = models.BooleanField(default=False, help_text="No entry fee")
    entry_fee = models.IntegerField(default=0, null=True, blank=True)  # in cents
    currency = models.CharField(
        max_length=3, choices=CurrencyEnum.choices, default=CurrencyEnum.BRL
    )
    prize_pool_enabled = models.BooleanField(default=True)

    max_teams = models.IntegerField(default=32)
    team_size = models.IntegerField(default=5, validators=[validate_team_size])

    registered_teams = models.ManyToManyField("teams.Team", blank=True, through="Registration")

    open_classification = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    challonge_tournament_id = models.IntegerField(null=True, blank=True)
    challonge_tournament_url = models.URLField(max_length=500, blank=True)

    about = models.TextField(default="", blank=True)
    current_round = models.IntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]

    def end_round(self):
        if self.current_round == self.get_number_of_rounds():
            raise ValueError("Tournament is already finished")
        self.current_round += 1
        self.save()

    def get_number_of_rounds(self):
        return math.log2(self.registrations.count())

    def is_last_round(self):
        return self.current_round == self.get_number_of_rounds()

    def start(self):
        now = datetime.now(tz=UTC)
        self.status = Tournament.StatusOptions.RUNNING
        self.current_round = 1
        if datetime.combine(self.start_date, self.start_time, tzinfo=UTC) > now:
            self.start_date = now.date()
            self.start_time = now.time()
        self.save()

    def cancel_registration(self, team):
        regi = Registration.objects.get(tournament=self, team=team)
        regi.cancel()

    def register(self, team: Team) -> "Registration":
        registration = Registration.objects.create(
            tournament=self,
            team=team,
            game_slug=self.game,
            platform_slug=self.platform,
        )

        return registration

    def add_team(self, team):
        self.teams.add(team)
        self.save()

    def is_checkin_open(self) -> bool:
        now = datetime.now(tz=UTC)
        start_at = datetime.combine(self.start_date, self.start_time)
        checkin_opens_at = start_at - timedelta(minutes=self.check_in_duration)

        return now > checkin_opens_at and now < start_at

    @abstractmethod
    def validate_participants(self):
        raise NotImplementedError

    @abstractmethod
    def get_classifications(self) -> list[str]:
        raise NotImplementedError

    def checkin(self):
        raise NotImplementedError


class Rule(models.Model):
    tournament = models.ForeignKey(Tournament, related_name="rules", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self) -> str:
        return self.title


class Prize(models.Model):
    tournament = models.ForeignKey(Tournament, related_name="prizes", on_delete=models.CASCADE)
    place = models.IntegerField()
    content = models.TextField(default="")

    class Meta:
        ordering = ["place"]

    def __str__(self) -> str:
        return self.id


class Registration(models.Model):
    class RegistrationStatusOptions(models.TextChoices):
        PENDING = "pending"
        ACCEPTED = "accepted"
        REJECTED = "rejected"
        CANCELLED = "cancelled"

    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(
        Tournament, related_name="registrations", on_delete=models.CASCADE
    )
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    game_slug = models.CharField(max_length=255)
    platform_slug = models.CharField(max_length=255)
    status = models.CharField(
        max_length=50,
        choices=RegistrationStatusOptions.choices,
        default=RegistrationStatusOptions.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    challonge_participant_id = models.IntegerField()

    def __str__(self) -> str:
        return f"Registration ({self.id}) | {self.tournament.name}"

    def confirm_registration(self):
        self.tournament.teams.add(self.team)
        self.tournament.save()
        self.status = Registration.RegistrationStatusOptions.ACCEPTED
        self.save()

    def cancel(self):
        self.tournament.teams.remove(self.team)
        self.status = Registration.RegistrationStatusOptions.CANCELLED
        self.save()


class Match(models.Model):
    class StatusType(models.TextChoices):
        SCHEDULED = "scheduled"
        NOT_STARTED = "not_started"
        UNDERWAY = "underway"
        ENDED = "ended"
        CANCELLED = "cancelled"

    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    round = models.IntegerField()
    tournament = models.ForeignKey(Tournament, related_name="matches", on_delete=models.CASCADE)
    team_a = models.ForeignKey(
        "teams.Team", related_name="team_a", on_delete=models.SET_NULL, null=True, blank=True
    )
    team_b = models.ForeignKey(
        "teams.Team", related_name="team_b", on_delete=models.SET_NULL, null=True, blank=True
    )
    winner = models.ForeignKey(
        "teams.Team", related_name="winner", on_delete=models.SET_NULL, null=True, blank=True
    )
    loser = models.ForeignKey(
        "teams.Team", related_name="loser", on_delete=models.SET_NULL, null=True, blank=True
    )
    status = models.CharField(
        max_length=50,
        choices=StatusType.choices,
        default=StatusType.NOT_STARTED,
    )

    team_a_score = models.IntegerField(default=0)
    team_b_score = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    challonge_match_id = models.IntegerField()

    metadata = models.JSONField(default=dict, blank=True, null=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"Match ({self.id}) | round: {0} | {self.tournament.name}"

    def set_winner(self, team):
        self.winner = team
        self.loser = self.team_a if self.team_a != team else self.team_b
        self.status = Match.StatusType.ENDED
        self.ended_at = datetime.now(tz=UTC)
        self.save()


class Checkin(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name="checkins")
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Checkin ({self.id}) | {self.tournament.name}"


# LEAGUE OF LEGENDS
class LeagueOfLegendsLeague(models.Model):
    class TierOptions(models.TextChoices):
        IRON = "IRON"
        BRONZE = "BRONZE"
        SILVER = "SILVER"
        GOLD = "GOLD"
        PLATINUM = "PLATINUM"
        EMERALD = "EMERALD"
        DIAMOND = "DIAMOND"
        MASTER = "MASTER"
        GRANDMASTER = "GRANDMASTER"
        CHALLENGER = "CHALLENGER"

    tier = models.CharField(max_length=25, choices=TierOptions.choices)

    class RankOptions(models.TextChoices):
        I = "I"  # noqa
        II = "II"
        III = "III"
        IV = "IV"

    rank = models.CharField(max_length=25, choices=RankOptions.choices)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["tier", "rank"]
        ordering = ["tier", "rank"]

    def __str__(self) -> str:
        return f"{self.tier} {self.rank}"


class LeagueOfLegendsProvider(models.Model):
    class RegionOptions(models.TextChoices):
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
        max_length=10, choices=RegionOptions.choices, default=RegionOptions.BR
    )
    url = models.URLField(
        editable=True,
        null=False,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"League of Legends Provider ({self.id})"


class LeagueOfLegendsTournament(Tournament):
    class PickType(models.TextChoices):
        BLIND_PICK = "BLIND_PICK"
        DRAFT_MODE = "DRAFT_MODE"
        ALL_RANDOM = "ALL_RANDOM"
        TOURNAMENT_DRAFT = "TOURNAMENT_DRAFT"

    class MapOptions(models.TextChoices):
        SUMMONERS_RIFT = "SUMMONERS_RIFT"
        TWISTED_TREELINE = "TWISTED_TREELINE"
        HOWLING_ABYSS = "HOWLING_ABYSS"

    class SpectatorOptions(models.TextChoices):
        NONE = "NONE"
        LOBBYONLY = "LOBBYONLY"
        ALL = "ALL"

    provider = models.ForeignKey(
        LeagueOfLegendsProvider,
        on_delete=models.DO_NOTHING,
        null=True,
        blank=True,
    )
    pick = models.CharField(max_length=50, choices=PickType.choices, default=PickType.BLIND_PICK)
    map = models.CharField(
        max_length=50, choices=MapOptions.choices, default=MapOptions.SUMMONERS_RIFT
    )
    spectator = models.CharField(
        max_length=50,
        choices=SpectatorOptions.choices,
        default=SpectatorOptions.LOBBYONLY,
    )
    classifications = models.ManyToManyField(LeagueOfLegendsLeague, blank=True)
    riot_tournament_id = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def get_classifications(self) -> list[str]:
        return [f"{entry.tier} {entry.rank}" for entry in self.classifications.all()]

    def __str__(self) -> str:
        return f"{self.name} ({self.uuid})"


class Participant(models.Model):
    team = models.CharField(max_length=255)
    nickname = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    tournament = models.ForeignKey(
        Tournament, related_name="participants", on_delete=models.CASCADE
    )

    class Meta:
        indexes = [models.Index(fields=["team"], name="team_idx")]

    def __str__(self) -> str:
        return self.nickname
