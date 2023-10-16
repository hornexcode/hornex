from django.db.models.signals import post_save
from django.dispatch import receiver
from teams.models import Team, TeamMember


@receiver(post_save, sender=Team)
def create_team_member(sender, instance, created, **kwargs):
    if created:
        user = instance.created_by
        team_member = TeamMember.objects.create(team=instance, user=user, is_admin=True)
