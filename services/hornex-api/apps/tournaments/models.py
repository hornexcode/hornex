import uuid
import datetime

from django.db import models
from abc import abstractmethod
from rest_framework.exceptions import ValidationError

from apps.tournaments.validators import validate_team_size
from apps.tournaments import errors
from apps.teams.models import Team


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

    class TournamentStatusType(models.TextChoices):
        NOT_STARTED = "not_started"
        STARTED = "started"
        FINISHED = "finished"
        CANCELLED = "cancelled"

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
    status = models.CharField(
        max_length=50,
        choices=TournamentStatusType.choices,
        default=TournamentStatusType.NOT_STARTED,
    )

    start_date = models.DateField()
    end_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()

    feature_image = models.CharField(max_length=255, null=True, blank=True)

    is_entry_free = models.BooleanField(default=False, help_text="No entry fee")
    is_prize_pool_fixed = models.BooleanField(
        default=True, help_text="Fixed prize pool"
    )

    prize_pool = models.IntegerField(default=0, null=True, blank=True)
    entry_fee = models.IntegerField(default=0, null=True, blank=True)

    max_teams = models.IntegerField(default=0)
    team_size = models.IntegerField(default=5, validators=[validate_team_size])

    teams = models.ManyToManyField("teams.Team", blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def is_full(self):
        return Registration.objects.filter(tournament=self).count() >= self.max_teams

    def team_has_enough_members(self, team):
        return team.members.count() >= self.team_size

    def team_has_registration(self, team):
        return Registration.objects.filter(tournament=self, team=team).exists()

    def team_members_can_play(self, team: Team):
        return all(
            [
                member.can_play(
                    game=Tournament.GameType.LEAGUE_OF_LEGENDS,
                    classification=self.get_classification(),
                )
                for member in team.members.all()
            ]
        )

    def register(self, team):
        if self.is_full():
            raise ValidationError(detail=errors.TournamentFullError)
        if self.team_has_registration(team):
            raise ValidationError(detail=errors.TeamAlreadyRegisteredError)
        if not self.team_has_enough_members(team):
            raise ValidationError(detail=errors.EnoughMembersError)
        if not self.team_members_can_play(team):
            raise ValidationError(detail=errors.TeamMemberIsNotAllowedToRegistrate)

        return Registration.objects.create(tournament=self, team=team)

    def cancel_registration(self, team):
        regi = Registration.objects.get(tournament=self, team=team)
        regi.cancel()

    def subscribe(self, team, payment_date: datetime):
        Subscription.objects.create(
            tournament=self,
            entry_fee=self.entry_fee,
            team=team,
            payment_date=payment_date,
        )

        self.teams.add(team)
        self.save()

    @abstractmethod
    def get_classification(self):
        raise NotImplementedError

    def generate_brackets(self):
        pass

    def start(self):
        self.validate()
        self.validate_participants()
        # Migh be async
        self.notifiy_participants()
        # Migh be async
        self.generate_brackets()

    def validate(self):
        pass

    @abstractmethod
    def validate_participants(self):
        raise NotImplementedError

    def notifiy_participants(self):
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

    status = models.CharField(
        max_length=50,
        choices=RegistrationStatusType.choices,
        default=RegistrationStatusType.PENDING,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.tournament.name} \
            | team: {self.team.name} ({self.id}) \
            | entry fee: ${self.tournament.entry_fee}"

    def accept(self):
        self.status = Registration.RegistrationStatusType.ACCEPTED
        self.save()

    def cancel(self):
        self.status = Registration.RegistrationStatusType.CANCELLED
        self.save()


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
