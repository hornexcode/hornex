import uuid
from django.db import models


class Notification(models.Model):
    class ActivityType(models.TextChoices):
        TEAM_INVITATION = "team_invitation", ("Team Invitation")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    activity = models.CharField(
        max_length=255,
        choices=ActivityType.choices,
        default=ActivityType.TEAM_INVITATION,
    )

    data = models.JSONField()
    recipient_id = models.UUIDField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    read_at = models.DateTimeField(null=True, blank=True)
