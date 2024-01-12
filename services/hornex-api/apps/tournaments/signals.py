import os

from django.db.models.signals import post_save
from django.dispatch import receiver

import lib.challonge as challonge
from apps.tournaments.models import Tournament

challonge.api_key = os.getenv("CHALLONGE_API_KEY")


@receiver(post_save, sender=Tournament)
def tournament_created(sender, instance, created, **kwargs):
    if created:
        create_remote_tournament(instance)


def create_remote_tournament(tournament: Tournament):
    print("FIRED SIGNAL ________________")
    challonge.Tournament.create(
        name=tournament.name, description=tournament.description
    )
