import uuid
from abc import abstractmethod
from datetime import UTC, datetime, timedelta
from typing import Optional

import structlog
from django.conf import settings
from django.db import models
from rest_framework.exceptions import ValidationError

from apps.common.models import BaseModel
from apps.teams.models import Team
from apps.tournaments import errors
from apps.tournaments.validators import validate_team_size

logger = structlog.get_logger(__name__)

MINIMUM_PARTICIPANTS = 0


class Tournament(BaseModel):
    class StatusOptions(models.TextChoices):
        ANNOUNCED = "announced"
        REGISTERING = "registering"
        RUNNING = "running"
        FINISHED = "finished"
        CANCELLED = "cancelled"

    class CurrencyEnum(models.TextChoices):
        USD = "USD"
        BRL = "BRL"
        EUR = "EUR"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    feature_image = models.CharField(max_length=255, blank=True)

    is_entry_free = models.BooleanField(default=False, help_text="No entry fee")
    entry_fee = models.IntegerField(default=0, null=True, blank=True)  # in cents
    currency = models.CharField(
        max_length=3, choices=CurrencyEnum.choices, default=CurrencyEnum.BRL
    )
    prize_pool_enabled = models.BooleanField(default=True)

    max_teams = models.IntegerField(default=32)
    team_size = models.IntegerField(default=5, validators=[validate_team_size])

    teams = models.ManyToManyField("teams.Team", related_name="tournaments", blank=True)

    open_classification = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    challonge_tournament_id = models.IntegerField(null=True, blank=True)
    challonge_tournament_url = models.URLField(max_length=500, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def _get_last_round(self):
        # last_round = self.rounds.all().order_by("-created_at").first()
        # if not last_round:
        #     raise ValueError("No rounds found")
        # return last_round
        return None

    def _get_allowed_number_of_teams(self) -> list[int]:
        try:
            max = int(settings.TOURNAMENT_TEAMS_LIMIT_POWER_NUMBER)
        except ValueError:
            raise Exception("invalid settings.TOURNAMENT_TEAMS_LIMIT_POWER_NUMBER")

        return (
            [2**i for i in range(1, max + 1)]
            if self._is_first_round()
            else [2**i for i in range(1, max + 1)][::-1]
        )

    def _get_number_of_teams(self):
        return self.teams.count()

    def _get_key(self):
        return

    def _is_bracket_generation_allowed(self):
        if self._is_first_round():
            return True

        return not Match.objects.filter(tournament=self, winner_id__isnull=True).exists()

    def _is_first_round(self):
        # return self.rounds.count() == 0
        return 0

    def _has_start_datetime(self):
        return bool(self.start_date) and bool(self.start_time)

    def start(self, timestamp: Optional[datetime]):
        if not timestamp:
            timestamp = datetime.now(tz=UTC)

        self.status = Tournament.StatusOptions.RUNNING
        if datetime.combine(self.start_date, self.start_time, tzinfo=UTC) > timestamp:
            self.start_date = timestamp.date()
            self.start_time = timestamp.time()
        self.save()

    def get_number_of_rounds(self):
        num_of_teams = self._get_number_of_teams()
        if num_of_teams <= 2:
            return 1

        if num_of_teams <= 4:
            return 2

        if num_of_teams <= 8:
            return 3

        if num_of_teams <= 16:
            return 4

        if num_of_teams <= 32:
            return 5

        return 0

    def cancel_registration(self, team):
        regi = Registration.objects.get(tournament=self, team=team)
        regi.cancel()

    def generate_brackets(self, print_brackets=False):
        # key = self._get_key()

        # rounds = self.rounds.all()
        # rounds = 0
        # num_rounds = len(rounds)

        if not self._is_bracket_generation_allowed():
            raise ValidationError(detail=errors.BracketGenerationNotAllowedError)

        # TODO: Clean this up
        # if num_rounds == 0: # First round
        # else get the last round and get the winners
        if not self._is_first_round():
            teams = self._get_last_round().get_winners()  # -> QuerySet[Team]
        else:
            teams = self.teams.all()  # -> QuerySet[Team]

        # round = Round.objects.create(
        #     tournament=self, key=key, name=f"Round {num_rounds + 1}"
        # )
        # round = None

        num_of_teams = len(teams)
        if num_of_teams not in self._get_allowed_number_of_teams():
            raise ValueError(
                "Number of teams must be in " f"{self._get_allowed_number_of_teams().__str__()}"
            )
        # for i in range(0, int(num_of_teams / 2)):
        # Match.objects.create(
        #     tournament=self,
        #     team_a_id=teams[i].id,
        #     team_b_id=teams[num_of_teams - i - 1].id,
        #     round=round,
        #     is_wo=True,
        # )

        if print_brackets:
            # Determine the width of the bracket
            max_team_len = max(len(team.name) for team in teams)
            # bracket_width = max_team_len + 4  # padding and borders

            for bracket in Match.objects.filter(tournament=self):
                # logger.warning(round.name.center(bracket_width))
                team1 = bracket.team_a_id.__str__().ljust(max_team_len)
                team2 = bracket.team_b_id.__str__().rjust(max_team_len)

                v = f"| {team1} | vs | {team2} |"
                print("-" * len(v))
                print(v)
                # logger.warning("-" * len(v))

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

    @property
    def is_full(self):
        now = datetime.now(tz=UTC)

        accepted_registrations = Registration.objects.filter(
            tournament=self, status=Registration.RegistrationStatusOptions.ACCEPTED
        ).count()

        # get the number of pending registrations that are not paid
        # in 2 hours
        pending_registrations = Registration.objects.filter(
            tournament=self,
            status=Registration.RegistrationStatusOptions.PENDING,
            created_at__gt=now - timedelta(hours=1),
        ).count()

        return accepted_registrations + pending_registrations >= self.max_teams

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


class Prize(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    place = models.IntegerField()
    is_money = models.BooleanField(default=False)
    amount = models.FloatField()  # cents
    content = models.TextField(default="")

    def __str__(self) -> str:
        return f"Prize ({self.id}) | {self.tournament.name} - {self.place}º"


class Registration(models.Model):
    class RegistrationStatusOptions(models.TextChoices):
        PENDING = "pending"
        ACCEPTED = "accepted"
        REJECTED = "rejected"
        CANCELLED = "cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    game_slug = models.CharField(max_length=255)
    platform_slug = models.CharField(max_length=255)
    status = models.CharField(
        max_length=50,
        choices=RegistrationStatusOptions.choices,
        default=RegistrationStatusOptions.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.team.name} registration at {self.tournament.name} ({self.id})"

    @property
    def pk(self) -> str:
        return str(self.id)

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
        FUTURE = "future"
        PAST = "past"
        LIVE = "live"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team_a_id = models.UUIDField()
    team_b_id = models.UUIDField()
    winner_id = models.UUIDField(null=True, blank=True)
    loser_id = models.UUIDField(null=True, blank=True)
    is_wo = models.BooleanField()
    status = models.CharField(
        max_length=50,
        choices=StatusType.choices,
        default=StatusType.FUTURE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Match ({self.id}) | round: {0} | {self.tournament.name}"

    @property
    def team_a(self):
        return Team.objects.get(id=self.team_a_id)

    @property
    def team_b(self):
        return Team.objects.get(id=self.team_b_id)

    def set_winner(self, team_id):
        if team_id not in [self.team_a_id, self.team_b_id]:
            raise ValueError("Invalid team id")

        self.winner_id = team_id
        self.loser_id = self.team_a_id if team_id == self.team_b_id else self.team_b_id

        self.save()

    def get_winner(self):
        return Team.objects.get(id=self.winner_id)

    def get_loser(self):
        return Team.objects.get(id=self.loser_id)


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
    classifications = models.ManyToManyField(LeagueOfLegendsLeague)
    riot_tournament_id = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def get_classifications(self) -> list[str]:
        return [f"{entry.tier} {entry.rank}" for entry in self.classifications.all()]

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class Participant(models.Model):
    team = models.CharField(max_length=255)
    nickname = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)

    class Meta:
        indexes = [models.Index(fields=["team"], name="team_idx")]

    def __str__(self) -> str:
        return self.nickname
