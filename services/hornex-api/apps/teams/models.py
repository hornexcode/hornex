import uuid
from datetime import UTC
from datetime import datetime as dt

from django.db import models

from apps.accounts.models import GameID
from apps.common.models import BaseModel


class Team(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=100, blank=True)
    members = models.ManyToManyField(GameID, through="Member", related_name="teams")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey("users.User", on_delete=models.CASCADE)

    def _has_enough_members(self, amount: int) -> bool:
        if self.members.count() != amount:
            raise Exception(f"Team {self.name} does not have {amount} members.")
        return True

    def is_member(self, game_id: GameID):
        return self.members.filter(id=game_id.id).exists()

    def add_member(self, game_id, is_admin=False):
        Member.objects.create(team=self, game_id=game_id, is_admin=is_admin)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class Member(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    game_id = models.ForeignKey(GameID, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"{self.game_id.nickname} - {self.team.name}"


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
        self.team.add_member(self.user.game_id)
        self.accepted_at = dt.now(tz=UTC)
        self.save()

    def decline(self):
        self.declined_at = dt.now(tz=UTC)
        self.save()

    def expire(self):
        self.expired_at = dt.now(tz=UTC)
        self.save()

    def __str__(self) -> str:  # noqa
        return f"Invite from {self.team.name} to {self.user.name} - ({self.status()})"
