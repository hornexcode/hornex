import uuid
from datetime import UTC
from datetime import datetime as dt

from django.db import models

from apps.common.models import BaseModel


class Team(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=100, blank=True)
    created_by = models.ForeignKey("users.User", on_delete=models.DO_NOTHING)
    members = models.ManyToManyField(
        "users.User", through="Membership", related_name="teams"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"

    def _has_enough_members(self, amount: int) -> bool:
        if self.members.count() != amount:
            raise Exception(f"Team {self.name} does not have {amount} members.")
        return True

    def add_member(self, user, is_admin=False):
        self.members.add(user)


class Membership(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)

    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.user.email} :: ({self.team.name})"

    def can_play(self, game, classifications):
        u = self.user
        return u.can_play(game, classifications)


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
