import uuid
from django.db import models
from datetime import datetime as dt, timezone as tz


class Team(models.Model):
    class GameType(models.TextChoices):
        LEAGUE_OF_LEGENDS = "league-of-legends"

    class PlatformType(models.TextChoices):
        PC = "pc"
        PS4 = "ps4"
        XBOX = "xbox"
        MOBILE = "mobile"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=100, null=True, blank=True)
    game = models.CharField(
        choices=GameType.choices, max_length=50, default=GameType.LEAGUE_OF_LEGENDS
    )
    platform = models.CharField(
        choices=PlatformType.choices, max_length=50, default=PlatformType.PC
    )
    created_by = models.ForeignKey("users.User", on_delete=models.RESTRICT)
    members = models.ManyToManyField(
        "users.User", through="Membership", related_name="teams"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deactivated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def _has_enough_members(self, amount: int) -> bool:
        if self.members.count() != amount:
            raise Exception(f"Team {self.name} does not have {amount} members.")
        return True


class Membership(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)

    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.user.email} :: ({self.team.name})"

    def can_play(self, tier: str):
        u = self.user
        return u.can_play(tier)


class Invite(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    declined_at = models.DateTimeField(null=True, blank=True)
    expired_at = models.DateTimeField(null=True, blank=True)

    def status(self):
        if self.accepted_at is not None:
            return "accepted"
        if self.declined_at is not None:
            return "declined"
        return "pending"

    def accept(self):
        Membership.objects.create(team=self.team, user=self.user)
        self.accepted_at = dt.now(tz=tz.utc)
        self.save()

    def __str__(self) -> str:
        return f"Invite from {self.team.name} to {self.user.name} - ({self.status()})"
