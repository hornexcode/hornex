from django.db import models


class Notification(models.Model):
    class ActivityType(models.TextChoices):
        TEAM_INVITATION = "team_invitation", ("Team Invitation")

    name = models.CharField(max_length=255)
    activity = models.CharField(
        max_length=255,
        choices=ActivityType.choices,
        default=ActivityType.TEAM_INVITATION,
    )

    data = models.JSONField()
    user_id = models.UUIDField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    read_at = models.DateTimeField(null=True, blank=True)
