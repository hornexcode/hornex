import json
from django.db.models.signals import post_save
from django.dispatch import receiver
from teams.models import Team, TeamMember, TeamInvite
from notifications.models import Notification
from asgiref.sync import async_to_sync
import channels.layers


@receiver(post_save, sender=Team)
def team_created(sender, instance, created, **kwargs):
    if created:
        user = instance.created_by
        TeamMember.objects.create(team=instance, user=user, is_admin=True)


@receiver(post_save, sender=TeamInvite)
def invite_created(sender, instance, created, **kwargs):
    if created:
        notification = Notification.objects.create(
            name=instance.__str__(),
            data=json.dumps(
                {
                    "team": {
                        "id": instance.team.id.__str__(),
                        "name": instance.team.name,
                    }
                }
            ),
            activity=Notification.ActivityType.TEAM_INVITATION,
            recipient_id=instance.user.id,
        )

        timestamp_in_milliseconds = int(notification.created_at.timestamp() * 1000)
        channel_layer = channels.layers.get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"notifications_{instance.user.id}",
            message={
                "id": notification.id.__str__(),
                "type": notification.activity,
                "message": "You have been invited to join a team",
                "data": json.loads(notification.data),
                "created_at": timestamp_in_milliseconds,
            },
        )
