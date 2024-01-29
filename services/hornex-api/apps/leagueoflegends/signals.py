from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.leagueoflegends.models import Tournament
from apps.leagueoflegends.tasks import create_tournament


@receiver(post_save, sender=Tournament)
def tournament_created(sender, instance, created, **kwargs):
    if created:
        challonge_tournament(tournament=instance)


def challonge_tournament(tournament):
    create_tournament(tournament_id=tournament.id)
