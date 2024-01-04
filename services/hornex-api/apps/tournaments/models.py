import uuid
from abc import abstractmethod
from datetime import UTC, datetime, timedelta

from django.conf import settings
from django.db import models
from django.db.models.query import QuerySet
from rest_framework.exceptions import ValidationError

from apps.teams.models import Team
from apps.tournaments import errors
from apps.tournaments.validators import validate_team_size


class RegistrationError(Exception):
    pass


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

    class PhaseType(models.TextChoices):
        REGISTRATION_OPEN = "registration_open"
        RESULTS_TRACKING = "results_tracking"
        PAYMENT_PENDING = "payment_pending"
        FINISHED_AND_PAID = "finished_and_paid"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    organizer = models.ForeignKey("users.User", on_delete=models.RESTRICT)
    game = models.CharField(
        choices=GameType.choices, max_length=50, default=GameType.LEAGUE_OF_LEGENDS
    )
    platform = models.CharField(
        choices=PlatformType.choices, max_length=50, default=PlatformType.PC
    )
    is_public = models.BooleanField(default=False)

    phase = models.CharField(
        max_length=50,
        choices=PhaseType.choices,
        default=PhaseType.REGISTRATION_OPEN,
    )

    registration_start_date = models.DateTimeField()
    registration_end_date = models.DateTimeField()

    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    feature_image = models.CharField(max_length=255, null=True, blank=True)

    is_entry_free = models.BooleanField(default=False, help_text="No entry fee")
    entry_fee = models.IntegerField(default=0, null=True, blank=True)  # in cents
    prize_pool = models.IntegerField(default=0, null=True, blank=True)  # in centes

    max_teams = models.IntegerField(default=32)
    team_size = models.IntegerField(default=5, validators=[validate_team_size])

    teams = models.ManyToManyField("teams.Team", related_name="tournaments", blank=True)

    is_classification_open = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def _check_team_has_enough_members(self, team):
        return team.members.count() >= self.team_size

    def _check_team_has_registration(self, team):
        return Registration.objects.filter(tournament=self, team=team).exists()

    def _check_team_members_can_play(self, team: Team):
        return all(
            [
                member.can_play(
                    game=self.game,
                    classifications=self.get_classifications(),  # ["1","4","5"]
                )
                for member in team.members.all()
            ]
        )

    def _get_last_round(self) -> "Round":
        last_round = self.rounds.all().order_by("-created_at").first()
        if not last_round:
            raise ValueError("No rounds found")
        return last_round

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
        if self.keys.count() == 0:
            return Key.objects.create(tournament=self)
        return self.keys.first()

    def _is_bracket_generation_allowed(self):
        if self._is_first_round():
            return True

        return not Match.objects.filter(
            tournament=self, winner_id__isnull=True
        ).exists()

    def _is_first_round(self):
        return self.rounds.count() == 0

    def _has_start_datetime(self):
        return bool(self.start_date) and bool(self.start_time)

    def start(self):
        if not self._has_start_datetime():
            raise ValidationError(detail=errors.TournamentHasNoStartDateTime)

        self.phase = Tournament.PhaseType.RESULTS_TRACKING
        self.save()

        self.generate_brackets()

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

    def add_team(self, team: Team):
        if not self._check_team_has_registration(team):
            return

        self.teams.add(team)
        self.save()

    def generate_brackets(self, print_brackets=False):
        key = self._get_key()

        rounds = self.rounds.all()
        num_rounds = len(rounds)

        if not self._is_bracket_generation_allowed():
            raise ValidationError(detail=errors.BracketGenerationNotAllowedError)

        # TODO: Clean this up
        # if num_rounds == 0: # First round
        # else get the last round and get the winners
        if not self._is_first_round():
            teams = self._get_last_round().get_winners()  # -> QuerySet[Team]
        else:
            teams = self.teams.all()  # -> QuerySet[Team]

        round = Round.objects.create(
            tournament=self, key=key, name=f"Round {num_rounds + 1}"
        )

        num_of_teams = len(teams)
        if num_of_teams not in self._get_allowed_number_of_teams():
            raise ValueError(
                f"Number of teams must be in {self._get_allowed_number_of_teams().__str__()}"
            )
        for i in range(0, int(num_of_teams / 2)):
            Match.objects.create(
                tournament=self,
                team_a_id=teams[i].id,
                team_b_id=teams[num_of_teams - i - 1].id,
                round=round,
                is_wo=True,
            )

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

    def register(self, team):
        if self._is_full():
            raise ValidationError(detail=errors.TournamentFullError)
        if self._check_team_has_registration(team):
            raise ValidationError(detail=errors.TeamAlreadyRegisteredError)
        if not self._check_team_has_enough_members(team):
            raise ValidationError(detail=errors.EnoughMembersError)
        if not self.is_classification_open and not self._check_team_members_can_play(
            team
        ):
            raise ValidationError(detail=errors.TeamMemberIsNotAllowedToRegistrate)

        return Registration.objects.create(
            tournament=self, team=team, game_slug=self.game, platform_slug=self.platform
        )

    def _is_full(self):
        now = datetime.now(tz=UTC)

        accepted_registrations = Registration.objects.filter(
            tournament=self, status=Registration.RegistrationStatusType.ACCEPTED
        ).count()

        # get the number of pending registrations that are not paid
        # in 2 hours
        pending_registrations = Registration.objects.filter(
            tournament=self,
            status=Registration.RegistrationStatusType.PENDING,
            created_at__gt=now - timedelta(hours=1),
        ).count()

        return accepted_registrations + pending_registrations >= self.max_teams

    @abstractmethod
    def validate_participants(self):
        raise NotImplementedError

    @abstractmethod
    def get_classifications(self) -> list[str]:
        raise NotImplementedError


class Subscription(models.Model):
    class StatusOptions(models.TextChoices):
        ACTIVE = "active"
        PENDING = "pending"
        UNPAID = "unpaid"
        REFUNDED = "refunded"
        CANCELLED = "cancelled"
        PAST_DUE = "past_due"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    entry_fee = models.IntegerField(default=0, null=True, blank=True)
    status = models.CharField(
        max_length=50,
        choices=StatusOptions.choices,
        default=StatusOptions.PENDING,
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.tournament.name} :: {self.team.name} ({self.id})"


class RegistrationManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status__in=["accepted", "pending"])


class Registration(models.Model):
    class RegistrationStatusType(models.TextChoices):
        PENDING = "pending"
        ACCEPTED = "accepted"
        REJECTED = "rejected"
        CANCELLED = "cancelled"

    objects = RegistrationManager()

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    game_slug = models.CharField(max_length=255)
    platform_slug = models.CharField(max_length=255)
    status = models.CharField(
        max_length=50,
        choices=RegistrationStatusType.choices,
        default=RegistrationStatusType.PENDING,
    )

    @property
    def pk(self) -> str:
        return self.id.__str__()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.team.name} registratrion at {self.tournament.name} ({self.id.__str__()})"

    def confirm_registration(self):
        self.tournament.add_team(self.team)
        self.status = Registration.RegistrationStatusType.ACCEPTED
        self.save()

    def cancel(self):
        self.tournament.teams.remove(self.team)
        self.status = Registration.RegistrationStatusType.CANCELLED
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
    round = models.ForeignKey("Round", on_delete=models.CASCADE, related_name="matches")
    is_wo = models.BooleanField()
    status = models.CharField(
        max_length=50,
        choices=StatusType.choices,
        default=StatusType.FUTURE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"Match ({self.id}) | round: {self.round} | {self.tournament.name}"

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


class MatchRound(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    team_a_id = models.UUIDField()
    team_b_id = models.UUIDField()
    team_a_score = models.CharField(max_length=255)
    team_b_score = models.CharField(max_length=255)
    schedule = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Round(models.Model):
    tournament = models.ForeignKey(
        Tournament, on_delete=models.CASCADE, related_name="rounds"
    )
    name = models.CharField(max_length=255)
    key = models.ForeignKey("Key", on_delete=models.CASCADE, related_name="rounds")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"Round ({self.id}) | {self.tournament.name}"

    class Meta:
        ordering = ["-created_at"]

    def get_winners(self) -> QuerySet[Team]:
        return Team.objects.filter(id__in=self.get_winner_ids())

    def get_winner_ids(self):
        return [bracket.winner_id for bracket in self.matches.all()]


class Key(models.Model):
    tournament = models.ForeignKey(
        Tournament, on_delete=models.CASCADE, related_name="keys"
    )
