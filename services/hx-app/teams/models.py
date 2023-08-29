from django.db import models
import uuid


class Team(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=30, unique=True)
    description = models.CharField(max_length=100, null=True, blank=True)
    game = models.ForeignKey("games.Game", on_delete=models.RESTRICT)
    platform = models.ForeignKey("platforms.Platform", on_delete=models.RESTRICT)
    created_by = models.ForeignKey("users.User", on_delete=models.RESTRICT)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deactivated_at = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} ({self.id})"


class TeamMember(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)

    joined_at = models.DateTimeField(auto_now_add=True)


class TeamInvite(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    accepted_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    expired_at = models.DateTimeField(null=True, blank=True)

    def status(self):
        if self.accepted_at is not None:
            return "accepted"
        if self.rejected_at is not None:
            return "rejected"
        return "pending"

    def __str__(self) -> str:
        return f"Invite from {self.team.name} to {self.user.name} - ({self.status()})"
